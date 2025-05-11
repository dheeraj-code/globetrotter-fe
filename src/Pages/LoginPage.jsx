import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRootStore } from "../Stores";
import { Button, Card, Input, Alert } from "antd";
import {
  PageContainer,
  InputGroup,
  Label,
  RegisterLink,
} from "../styles/LoginPageStyles";

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
