import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import { styled } from '@mui/system';
import { Button, TextField } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('https://effiscope.info:5021/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();

        // Save the token to local storage
        localStorage.setItem('token', data.accessToken);
        if (data.accessToken) {
          navigate('/');
        }
        // Display the token
        setResponseMessage(`Login successful! Token: ${data.accessToken}`);
      } else {
        // Handle error case
        const errorData = await response.json();
        setResponseMessage(errorData.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('An error occurred during login.');
    }
  };

  console.log(JSON.stringify(localStorage.getItem('token')));

  return (
    <Container
      sx={{
        width: '50%',
        boxShadow: '0px 0px 10px #333',
        borderRadius: '10px',
        margin: '0px auto',
        mt: 15,
        padding: 5,
      }}
    >
      <Title variant="h1" gutterBottom>
        Login
      </Title>
      <TextFieldStyled
        label="Email"
        variant="outlined"
        value={email}
        onChange={handleEmailChange}
        fullWidth
      />
      <TextFieldStyled
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        fullWidth
      />
      <ButtonStyled variant="contained" onClick={handleLogin}>
        Login
      </ButtonStyled>
      {responseMessage && <ResponseMessage>{responseMessage}</ResponseMessage>}
    </Container>
  );
};

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
`;

const Title = styled('h1')`
  margin-bottom: 2rem;
`;

const TextFieldStyled = styled(TextField)`
  margin-bottom: 1.5rem;
`;

const ButtonStyled = styled(Button)`
  background-color: #4caf50;
  color: white;

  &:hover {
    background-color: #45a049;
  }
`;

const ResponseMessage = styled('p')`
  margin-top: 1rem;
  color: red;
`;

export default Login;
