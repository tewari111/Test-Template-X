import React, { useEffect } from 'react';

import { Button } from '@mui/material';

function AwsLogin() {
  const handleButtonClick = () => {
    window.location.href = process.env.loginURL;
  };

  useEffect(() => {
    const handleRedirect = () => {
      const params = new URLSearchParams(window.location.hash.substr(1));
      const accessToken = params.get('access_token');
      localStorage.setItem('accessToken', accessToken);
      window.location.href = process.env.redirectURL;
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
