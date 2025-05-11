import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRootStore } from '../Stores';
import { Button, Alert, Typography } from "antd";
import { config } from '../config';
import {
  ResultsContainer,
  ResultsCard,
  ScorePercentage,
  ButtonContainer,
  ChallengeInfo,
  ShareLink,
} from "../styles/ResultsStyles";

const { Title, Text } = Typography;

const Results = ({ score, totalQuestions, onRestart }) => {
  const [copied, setCopied] = useState(false);
  const [challengeError, setChallengeError] = useState(null);
  const {
    isChallenge,
    challengerScore,
    loading,
    error,
    inviteLink,
    sessionId,
    createChallenge,
    setLoading,
  } = useRootStore().quiz;

  const percentage = (score / totalQuestions) * 100;

  const getMessage = () => {
    if (percentage >= 80) {
      return "Excellent! You have a strong grasp of geography. Keep it up!";
    } else if (percentage >= 60) {
      return "Good effort! Continue exploring to enhance your knowledge.";
    } else {
      return "Keep practicing! Each quiz is an opportunity to learn more.";
    }
  };

  const handleShareChallenge = async () => {
    try {
      setChallengeError(null);

      if (!sessionId) {
        throw new Error('Quiz session has expired. Please start a new quiz to challenge friends.');
      }

      setLoading(true);
      const result = await createChallenge();

      if (error) {
        throw new Error(error);
      }

      if (!result || !result.inviteLink) {
        throw new Error('No invite link received from server');
      }
    } catch (error) {
      setChallengeError(error.message || 'Failed to create challenge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const challengeLink = `${config.appBaseUrl}/challenge/${inviteLink}`;
    navigator.clipboard.writeText(challengeLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shouldShowShareLink = !isChallenge && inviteLink && !loading;

  return (
    <ResultsContainer>
      <ResultsCard>
        <Title level={2} style={{ color: "#3498db" }}>Quiz Results</Title>

        {isChallenge && challengerScore !== null && (
          <ChallengeInfo>
            <Title level={4} style={{ color: "#e67e22" }}>Challenge Results</Title>
            <Text style={{ color: "#2c3e50" }}>
              Challenger's Score: {challengerScore} / {totalQuestions}
            </Text>
            <br />
            <Text style={{ color: "#2c3e50" }}>
              Your Score: {score} / {totalQuestions}
            </Text>
            {score > challengerScore ? (
              <Alert
                type="success"
                message="Congratulations! You outperformed the challenger!"
                showIcon
              />
            ) : score === challengerScore ? (
              <Alert
                type="info"
                message="It's a Tie! You matched the challenger's score."
                showIcon
              />
            ) : (
              <Alert
                type="error"
                message="Almost There! Try again to surpass the challenger's score."
                showIcon
              />
            )}
          </ChallengeInfo>
        )}

        <ScorePercentage $score={score} $total={totalQuestions}>
          {percentage.toFixed(0)}%
        </ScorePercentage>

        <Text style={{ color: "#2c3e50", fontSize: "16px" }}>{getMessage()}</Text>
        <br />
        <Text style={{ color: "#2c3e50", fontSize: "16px" }}>
          You answered {score} out of {totalQuestions} questions correctly!
        </Text>

        <ButtonContainer>
          {!isChallenge && !inviteLink && (
            <>
              <Button
                onClick={handleShareChallenge}
                type="primary"
                size="large"
                disabled={loading}
              >
                {loading ? 'Creating Challenge...' : 'Challenge Friends'}
              </Button>
              {(challengeError || error) && (
                <Alert
                  type="error"
                  message={challengeError || error}
                  showIcon
                />
              )}
            </>
          )}

          {shouldShowShareLink && (
            <ShareLink>
              <input
                type="text"
                readOnly
                value={`${config.appBaseUrl}/challenge/${inviteLink}`}
              />
              <Button
                onClick={handleCopyLink}
                type="primary"
                size="small"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            </ShareLink>
          )}

          <Button
            onClick={onRestart}
            type="primary"
            size="large"
          >
            {isChallenge ? 'Try Another Challenge' : 'Try Another Quiz'}
          </Button>
        </ButtonContainer>
      </ResultsCard>
    </ResultsContainer>
  );
};

Results.propTypes = {
  score: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  onRestart: PropTypes.func.isRequired,
};

export default Results;