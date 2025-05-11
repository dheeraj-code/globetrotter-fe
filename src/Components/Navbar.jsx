import React from "react";
import { useNavigate } from "react-router-dom";
import { useRootStore } from "../Stores";
import { Button, Typography } from "antd";
import { NavbarContainer, AuthButtons } from "../styles/NavbarStyles";

const { Title } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const { auth: authStore } = useRootStore();

  const handleLogout = async () => {
    await authStore.logout();
    navigate("/");
  };

  return (
    <NavbarContainer>
      <Title
        level={3}
        style={{ margin: 0, color: "black", cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        🚀 Explore Quiz
      </Title>

      <AuthButtons>
        {authStore.isAuthenticated ? (
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <>
            <Button type="primary" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button type="primary" onClick={() => navigate("/register")}>
              Sign Up
            </Button>
          </>
        )}
      </AuthButtons>
    </NavbarContainer>
  );
};

export default Navbar;
