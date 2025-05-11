import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import styled from "styled-components";
import { useRootStore } from "../Stores";
import { theme } from "../styles/theme";
import { Button, Card, Input, Alert } from "antd";

const PageContainer = styled.div`
  min-height: 90vh;
  width: 100%;
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};
  background-image: linear-gradient(
    to right top,
    #a4d0f2,
    #abc2f5,
    #c1b0ee,
    #dc9bd7,
    #f086b3
  );
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

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useRootStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (auth.isAuthenticated) {
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    }
  }, [auth.isAuthenticated, location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await auth.login(formData.email, formData.password);
      if (success) {
        auth.checkAuthStatus();
      }
    } catch (error) {
      console.error("Login submission error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <PageContainer>
      <Card title="Welcome Back">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {auth.error && (
            <Alert
              type="error"
              title="Login Error"
              message={auth.error}
              style={{ marginBottom: "1rem" }}
            />
          )}

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
              type="primary"
              // variant="accent"
              size="large"
              disabled={auth.loading}
              onClick={handleSubmit}
            >
              {auth.loading ? "Logging in..." : "Login"}
            </Button>

          <RegisterLink to="/register">
            Don't have an account? Sign up
          </RegisterLink>
        </div>
      </Card>
    </PageContainer>
  );
};

export default LoginPage;
