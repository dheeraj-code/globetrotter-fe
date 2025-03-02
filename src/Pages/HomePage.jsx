import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { authService } from '../Services/auth';
import { theme } from '../styles/theme';

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${theme.colors.background};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const WelcomeCard = styled.div`
  background: ${theme.colors.cardBg};
  padding: 3rem;
  border-radius: ${theme.borderRadius.large};
  box-shadow: ${theme.shadows.card};
  max-width: 1000px;
  width: 100%;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1.2rem;
  color: ${theme.colors.text};
  font-weight: bold;
  letter-spacing: -0.5px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.h2`
  color: ${theme.colors.accent};
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const Description = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.5;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const GameStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin: 3rem 0;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;

  .value {
    font-size: 2rem;
    font-weight: bold;
    color: ${theme.colors.accent};
    margin-bottom: 0.4rem;
  }

  .label {
    color: ${theme.colors.textSecondary};
    font-size: 0.9rem;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 3rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FeatureCard = styled.div`
  background: ${theme.colors.primary};
  padding: 1.5rem;
  border-radius: ${theme.borderRadius.medium};
  text-align: center;
  transition: ${theme.transitions.default};
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.hover};
  }

  h3 {
    color: ${theme.colors.accent};
    margin-bottom: 0.8rem;
    font-size: 1.2rem;
  }

  p {
    color: ${theme.colors.textSecondary};
    font-size: 0.95rem;
    line-height: 1.4;
  }
`;

const PlayButton = styled.button`
  padding: 1rem 2.5rem;
  font-size: 1.3rem;
  background: ${theme.colors.accent};
  color: ${theme.colors.text};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  transition: ${theme.transitions.default};
  box-shadow: ${theme.shadows.button};
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-top: 1.5rem;

  &:hover {
    transform: translateY(-3px);
    background: ${theme.colors.buttonHover};
    box-shadow: ${theme.shadows.hover};
  }
`;

const HomePage = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        console.log('HomePage mounted');
        console.log('Theme:', theme);
    }, []);

    const handlePlayClick = () => {
        if (authService.isAuthenticated()) {
            navigate('/game');
        } else {
            navigate('/login');
        }
    };
    
    return (
        <PageContainer>
            <WelcomeCard>
                <Title>GlobeTrotter</Title>
                <Subtitle>Your Global Geography Adventure</Subtitle>
                <Description>
                    Test your knowledge of cities around the world in this exciting quiz game!
                </Description>

                <GameStats>
                    <StatItem>
                        <div className="value">5</div>
                        <div className="label">Questions per Game</div>
                    </StatItem>
                    <StatItem>
                        <div className="value">100+</div>
                        <div className="label">Cities to Discover</div>
                    </StatItem>
                    <StatItem>
                        <div className="value">∞</div>
                        <div className="label">Possible Adventures</div>
                    </StatItem>
                </GameStats>

                <FeatureGrid>
                    <FeatureCard>
                        <h3>🤔 Clever Clues</h3>
                        <p>Solve challenging riddles and hints about each mystery city</p>
                    </FeatureCard>
                    <FeatureCard>
                        <h3>🌟 Multiple Choice</h3>
                        <p>Choose from four possible city locations for each question</p>
                    </FeatureCard>
                    <FeatureCard>
                        <h3>📚 Learn Facts</h3>
                        <p>Discover interesting trivia about each city after answering</p>
                    </FeatureCard>
                </FeatureGrid>

                <PlayButton onClick={handlePlayClick}>
                    Start Quiz
                </PlayButton>
            </WelcomeCard>
        </PageContainer>
    );
};

export default HomePage;