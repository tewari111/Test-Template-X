import React, { useEffect } from 'react';

import { Button } from '@mui/material';

function AwsLogin() {
  const handleButtonClick = () => {
    window.location.href =
      'https://secret-dash.auth.ap-southeast-2.amazoncognito.com/oauth2/authorize?client_id=2sba7j1pps1i03qm1o97np0t97&response_type=token&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3030%2F';
  };

  useEffect(() => {
    const handleRedirect = () => {
      const params = new URLSearchParams(window.location.hash.substr(1));
      const accessToken = params.get('access_token');
      localStorage.setItem('accessToken', accessToken);
      window.location.href = 'http://localhost:3030/';
    };

    // Check if the URL contains an access token
    if (window.location.hash) {
      handleRedirect();
    }
  }, []);
  // const access_token = localStorage.getItem('accessToken');
  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleButtonClick} sx={{ mr: 1 }}>
        Authenticate
      </Button>
    </div>
  );
}

export default AwsLogin;
