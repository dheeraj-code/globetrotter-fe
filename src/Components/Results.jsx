import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { useStores } from '../Stores';
import { theme } from '../Styles/theme';
import Button from '../Osborn/base/Button';
import Card from '../Osborn/base/Card';
import FeedbackMessage from '../Osborn/feedback/FeedbackMessage';

const ResultsContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: ${theme.spacing.lg};
`;

const ResultsCard = styled(Card)`
  text-align: center;
`;

const ScoreText = styled.h2`
  font-size: ${theme.typography.fontSize['2xl']};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md};
`;

const ScorePercentage = styled.div`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${props => {
    const percentage = (props.$score / props.$total) * 100;
    if (percentage >= 80) return theme.colors.success;
    if (percentage >= 60) return theme.colors.warning;
    return theme.colors.error;
  }};
  margin: ${theme.spacing.lg} 0;
`;

const MessageContainer = styled.div`
  margin: ${theme.spacing.lg} 0;
`;

const Message = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.md};
  margin: ${theme.spacing.xs} 0;
  line-height: ${theme.typography.lineHeight.relaxed};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.lg};
`;

const ChallengeInfo = styled.div`
  background: ${theme.colors.cardBg};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing.md};
  margin: ${theme.spacing.sm} 0;
  border: 1px solid ${theme.colors.accent}40;

  h3 {
    color: ${theme.colors.accent};
    font-size: ${theme.typography.fontSize.lg};
    margin-bottom: ${theme.spacing.sm};
  }
`;

const ShareLink = styled.div`
  background: ${theme.colors.primary};
  border-radius: ${theme.borderRadius.small};
  padding: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};

  input {
    flex: 1;
    background: transparent;
    border: none;
    color: ${theme.colors.text};
    font-size: 0.9rem;
    padding: 0.5rem;
    &:focus {
      outline: none;
    }
  }
`;

const Results = observer(({ score, totalQuestions, onRestart }) => {
  const [copied, setCopied] = useState(false);
  const [challengeError, setChallengeError] = useState(null);
  const { quizStore } = useStores();
  
  const {
    isChallenge,
    challengerScore,
    loading,
    error,
    inviteLink,
    sessionId
  } = quizStore;
  
  const percentage = (score / totalQuestions) * 100;

  const getMessage = () => {
    if (percentage >= 80) {
      return "Excellent! You're a geography expert! Keep challenging yourself!";
    } else if (percentage >= 60) {
      return "Good job! Keep exploring to improve your knowledge of the world!";
    } else {
      return "Keep practicing! Every quiz is a chance to learn more about our fascinating world!";
    }
  };

  const handleShareChallenge = async () => {
    try {
      setChallengeError(null);
      
      if (!sessionId) {
        throw new Error('Quiz session has expired. Please start a new quiz to challenge friends.');
      }
      
      quizStore.setLoading(true);
      const result = await quizStore.createChallenge();
      
      if (error) {
        throw new Error(error);
      }
      
      if (!result || !result.inviteLink) {
        throw new Error('No invite link received from server');
      }
    } catch (error) {
      setChallengeError(error.message || 'Failed to create challenge. Please try again.');
    } finally {
      quizStore.setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const challengeLink = `${window.location.origin}/challenge/${inviteLink}`;
    navigator.clipboard.writeText(challengeLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shouldShowShareLink = !isChallenge && inviteLink && !loading;

  return (
    <ResultsContainer>
      <ResultsCard padding="large">
        <ScoreText>Quiz Results</ScoreText>
        
        {isChallenge && challengerScore !== null && (
          <ChallengeInfo>
            <h3>🏆 Challenge Results</h3>
            <Message>
              Challenger's Score: {challengerScore} / {totalQuestions}
            </Message>
            <Message>
              Your Score: {score} / {totalQuestions}
            </Message>
            {score > challengerScore ? (
              <FeedbackMessage
                type="success"
                title="Congratulations! 🎉"
                message="You beat the challenger's score!"
              />
            ) : score === challengerScore ? (
              <FeedbackMessage
                type="info"
                title="It's a Tie! 🤝"
                message="You matched the challenger's score!"
              />
            ) : (
              <FeedbackMessage
                type="error"
                title="Almost There! 💪"
                message="Try again to beat the challenger's score!"
              />
            )}
          </ChallengeInfo>
        )}

        <ScorePercentage $score={score} $total={totalQuestions}>
          {percentage.toFixed(0)}%
        </ScorePercentage>
        
        <MessageContainer>
          <Message>{getMessage()}</Message>
          <Message>
            You answered {score} out of {totalQuestions} questions correctly!
          </Message>
        </MessageContainer>

        <ButtonContainer>
          {!isChallenge && !inviteLink && (
            <>
              <Button
                onClick={handleShareChallenge}
                variant="accent"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading ? 'Creating Challenge...' : 'Challenge Friends 🎮'}
              </Button>
              {(challengeError || error) && (
                <FeedbackMessage
                  type="error"
                  title="Challenge Creation Failed"
                  message={challengeError || error}
                />
              )}
            </>
          )}

          {shouldShowShareLink && (
            <ShareLink>
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/challenge/${inviteLink}`}
              />
              <Button
                onClick={handleCopyLink}
                variant="accent"
                size="small"
              >
                {copied ? 'Copied! ✓' : 'Copy Link'}
              </Button>
            </ShareLink>
          )}

          <Button
            onClick={onRestart}
            variant="primary"
            fullWidth
            size="large"
          >
            {isChallenge ? 'Try Another Challenge' : 'Try Another Quiz'}
          </Button>
        </ButtonContainer>
      </ResultsCard>
    </ResultsContainer>
  );
});

Results.propTypes = {
  score: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  onRestart: PropTypes.func.isRequired
};

export default Results; 