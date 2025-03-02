import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};
`;

const LoginCard = styled(Card)`
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize['2xl']};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Label = styled.label`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.xs};
`;

const Input = styled.input`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.small};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.cardBg};
  color: ${theme.colors.text};
  font-size: ${theme.typography.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }
`;

const RegisterLink = styled(Link)`
  color: ${theme.colors.accent};
  text-decoration: none;
  text-align: center;
  margin-top: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.xs};

  &:hover {
    text-decoration: underline;
  }
`;

const LoginPage = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authStore } = useStores();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    console.log('Auth state changed:', authStore.isAuthenticated);
    if (authStore.isAuthenticated) {
      const from = location.state?.from || '/';
      console.log('Redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [authStore.isAuthenticated, location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const success = await authStore.login(formData.email, formData.password);
      console.log('Login success:', success);
      if (success) {
        authStore.checkAuthStatus(); // Force a check of auth status
      }
    } catch (error) {
      console.error('Login submission error:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <PageContainer>
      <LoginCard padding="large">
        <Title>Welcome Back</Title>
        
        {authStore.error && (
          <FeedbackMessage
            type="error"
            title="Login Error"
            message={authStore.error}
            style={{ marginBottom: '1rem' }}
          />
        )}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </InputGroup>

          <Button
            type="submit"
            variant="accent"
            fullWidth
            size="large"
            disabled={authStore.loading}
          >
            {authStore.loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>

        <RegisterLink to="/register">
          Don't have an account? Sign up
        </RegisterLink>
      </LoginCard>
    </PageContainer>
  );
});

export default LoginPage; 