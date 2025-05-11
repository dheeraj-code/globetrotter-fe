import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { authService } from '../Services/auth';
import { theme } from '../styles/theme';

const PageContainer = styled.div`
  min-height: 90vh;
  width: 100%;
  background-color: ${theme.colors.background};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-image: linear-gradient(to right top, #a4d0f2, #abc2f5, #c1b0ee, #dc9bd7, #f086b3);
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
  font-size: ${theme.typography.fontSize['3xl']};
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.text};
  font-weight: ${theme.typography.fontWeight.bold};
  letter-spacing: -0.5px;
  line-height: ${theme.typography.lineHeight.tight};
  
  @media (max-width: 768px) {
    font-size: ${theme.typography.fontSize['2xl']};
  }
`;

const Subtitle = styled.h2`
  color: ${theme.colors.accent};
  font-size: ${theme.typography.fontSize.lg};
  margin-bottom: ${theme.spacing.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  line-height: ${theme.typography.lineHeight.normal};
  
  @media (max-width: 768px) {
    font-size: ${theme.typography.fontSize.md};
  }
`;

const Description = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.md};
  margin-bottom: ${theme.spacing.lg};
  line-height: ${theme.typography.lineHeight.relaxed};
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: ${theme.typography.fontSize.sm};
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
    font-size: ${theme.typography.fontSize['2xl']};
    font-weight: ${theme.typography.fontWeight.bold};
    color: ${theme.colors.accent};
    margin-bottom: ${theme.spacing.xs};
    line-height: ${theme.typography.lineHeight.tight};
  }

  .label {
    color: ${theme.colors.textSecondary};
    font-size: ${theme.typography.fontSize.xs};
    line-height: ${theme.typography.lineHeight.normal};
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
  padding: ${theme.spacing.md};
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
    margin-bottom: ${theme.spacing.sm};
    font-size: ${theme.typography.fontSize.md};
    font-weight: ${theme.typography.fontWeight.semibold};
    line-height: ${theme.typography.lineHeight.normal};
  }

  p {
    color: ${theme.colors.textSecondary};
    font-size: ${theme.typography.fontSize.sm};
    line-height: ${theme.typography.lineHeight.relaxed};
  }
`;

const PlayButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.xl};
  font-size: ${theme.typography.fontSize.lg};
  background: ${theme.colors.accent};
  color: ${theme.colors.text};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  transition: ${theme.transitions.default};
  box-shadow: ${theme.shadows.button};
  font-weight: ${theme.typography.fontWeight.semibold};
  letter-spacing: 0.5px;
  margin-top: ${theme.spacing.md};

  &:hover {
    transform: translateY(-3px);
    background: ${theme.colors.buttonHover};
    box-shadow: ${theme.shadows.hover};
  }
`;

const HomePage = () => {
    const navigate = useNavigate();
    
    const handlePlayClick = () => {
        if (authService.isAuthenticated()) {
            navigate('/play');
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