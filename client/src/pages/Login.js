import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoginForm = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  color: #4a5568;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  font-size: 1rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #5a67d8;
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Authentication logic here
    navigate('/dashboard');
  };

  return (
    <LoginContainer>
      <LoginForm>
        <Title>Login to Data Entry System</Title>
        <form onSubmit={handleLogin}>
          <InputGroup>
            <Label>Username</Label>
            <Input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Password</Label>
            <Input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          <Button type="submit">Login</Button>
        </form>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
