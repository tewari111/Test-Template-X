import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { Alert, Button, AlertTitle } from '@mui/material';

export default function ErrorPage({ errorMessage }) {
  const navigate = useNavigate();
  return (
    <div>
      <Alert severity="error" sx={{ mt: 10 }}>
        <AlertTitle>Error</AlertTitle>
        {errorMessage || 'There are some error'}
      </Alert>
      <Button
        onClick={() => navigate('/repos')}
        sx={{ mt: 3, alignItems: 'end' }}
        variant="contained"
      >
        Go Home Page
      </Button>
    </div>
  );
}

ErrorPage.propTypes = {
  errorMessage: PropTypes.string,
};
