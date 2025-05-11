import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { useRootStore } from "../Stores";
import { theme } from "../Styles/theme";
import { Button, Card, Input, Alert } from "antd";

const PageContainer = styled.div`
  min-height: 90vh;
  width: 100%;
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-image: linear-gradient(
    to right top,
    #a4d0f2,
    #abc2f5,
    #c1b0ee,
    #dc9bd7,
    #f086b3
  );
`;

const RegisterCard = styled(Card)`
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${theme.colors.text};
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const LoginLink = styled(Link)`
  color: ${theme.colors.accent};
  text-decoration: none;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { auth: authStore } = useRootStore();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await authStore.register(
        formData.username,
        formData.email,
        formData.password
      );
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <PageContainer>
      <RegisterCard padding="large" title={"Create Account"}>
        {error && (
          <Alert
            type="error"
            title="Registration Error"
            message={error}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <InputGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
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
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </InputGroup>

          <Button
            type="primary"
            size="large"
            disabled={authStore.loading}
            onClick={handleSubmit}
          >
            Register
          </Button>
          <LoginLink to="/login">Already have an account? Log in</LoginLink>
        </div>
      </RegisterCard>
    </PageContainer>
  );
};

export default RegisterPage;
