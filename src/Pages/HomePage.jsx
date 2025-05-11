import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../Services/auth';
import { Typography } from 'antd';
import {
  PageContainer,
  WelcomeCard,
  GameStats,
  StatItem,
  FeatureGrid,
  FeatureCard,
  PlayButton,
  GlobalTitle,
} from '../styles/HomePageStyles';

const { Title, Text } = Typography;

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
      <GlobalTitle>
        <Title level={1}>Globetrotter Quiz 🚀</Title>
      </GlobalTitle>
      <WelcomeCard>
        <Title level={2}>🌍 GlobeTrotter</Title>
        <Text strong>Explore the World Through Geography 🌎</Text>
        <Text>
          Challenge your knowledge of global cities in this engaging quiz game. 🌟
        </Text>

        <GameStats>
          <StatItem>
            <Text className="value">5</Text>
            <Text className="label">Questions Per Game</Text>
          </StatItem>
          <StatItem>
            <Text className="value">100+</Text>
            <Text className="label">Cities to Explore</Text>
          </StatItem>
          <StatItem>
            <Text className="value">∞</Text>
            <Text className="label">Adventures Await</Text>
          </StatItem>
        </GameStats>

        <FeatureGrid>
          <FeatureCard>
            <Title level={4}>🧩 Challenging Clues</Title>
            <Text>Answer thought-provoking questions about cities around the globe.</Text>
          </FeatureCard>
          <FeatureCard>
            <Title level={4}>📍 Multiple Choice</Title>
            <Text>Select the correct city from four possible options.</Text>
          </FeatureCard>
          <FeatureCard>
            <Title level={4}>📖 Learn Interesting Facts</Title>
            <Text>Discover fascinating trivia about each city after answering.</Text>
          </FeatureCard>
        </FeatureGrid>

        <PlayButton onClick={handlePlayClick}>🎮 Begin Quiz</PlayButton>
      </WelcomeCard>
    </PageContainer>
  );
};

export default HomePage;