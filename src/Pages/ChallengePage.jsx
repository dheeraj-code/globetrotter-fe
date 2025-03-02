import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { useStores } from '../Stores';
import { theme } from '../Styles/theme';
import Button from '../Osborn/base/Button';
import Card from '../Osborn/base/Card';
import FeedbackMessage from '../Osborn/feedback/FeedbackMessage';

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const ChallengeContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${theme.colors.background};
`;

const ChallengeCard = styled(Card)`
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${theme.colors.text};
  margin-bottom: 1.5rem;
`;

const Message = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;
  margin: 1rem 0;
  line-height: 1.5;
`;

const ScoreDisplay = styled.div`
  background: ${theme.colors.cardBg};
  border-radius: ${theme.borderRadius.medium};
  padding: 1.5rem;
  margin: 1.5rem 0;
  border: 1px solid ${theme.colors.accent}40;

  h3 {
    color: ${theme.colors.accent};
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    color: ${theme.colors.text};
  }
`;

const ChallengePage = observer(() => {
  const { inviteLink } = useParams();
  const navigate = useNavigate();
  const { authStore, quizStore } = useStores();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [challengeData, setChallengeData] = useState(null);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (!authStore.isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadChallengeInfo = async () => {
      try {
        setLoading(true);
        const data = await quizStore.getChallengeInfo(inviteLink);
        setChallengeData(data);

        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadChallengeInfo();
  }, [inviteLink, authStore.isAuthenticated, navigate, quizStore]);

  const handleStartChallenge = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Only start the challenge when the button is clicked
      await quizStore.startChallenge(inviteLink);
      setIsStarted(true);
      navigate('/play');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <ChallengeContainer>
          <ChallengeCard padding="large">
            <Message>Loading challenge...</Message>
          </ChallengeCard>
        </ChallengeContainer>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ChallengeContainer>
          <ChallengeCard padding="large">
            <FeedbackMessage
              type="error"
              title="Error"
              message={error}
            />
            <Button
              onClick={() => navigate('/')}
              variant="primary"
              fullWidth
              style={{ marginTop: '1rem' }}
            >
              Return Home
            </Button>
          </ChallengeCard>
        </ChallengeContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ChallengeContainer>
        <ChallengeCard padding="large">
          <Title>Challenge Invitation! 🎮</Title>
          <Message>
            You've been invited to take on a geography quiz challenge!
          </Message>

          {challengeData && (
            <ScoreDisplay>
              <h3>Challenger's Score</h3>
              <p>{challengeData.inviterScore} / {challengeData.totalQuestions}</p>
            </ScoreDisplay>
          )}

          <Message>
            Think you can beat their score? Accept the challenge and find out!
          </Message>

          <Button
            onClick={handleStartChallenge}
            variant="accent"
            fullWidth
            size="large"
            disabled={isStarted}
          >
            {isStarted ? 'Challenge Started...' : 'Accept Challenge'}
          </Button>
        </ChallengeCard>
      </ChallengeContainer>
    </PageContainer>
  );
});

export default ChallengePage; 