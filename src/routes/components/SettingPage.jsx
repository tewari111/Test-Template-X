import React, { useState, useEffect, useCallback } from 'react';

import {
  Grid,
  Paper,
  Dialog,
  Button,
  TextField,
  Container,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import ErrorPage from 'src/sections/error/ErrorPage';

const SettingPage = () => {
  const [formData, setFormData] = useState({
    git: '',
    access_token: '',
    url: '',
    PRcomment: '',
    blockPR: false,
  });
  const access_token = localStorage.getItem('accessToken');
  console.log('access_token', access_token);
  const accessToken = localStorage.getItem('accessToken');
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(process.env.settings, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      }
    } catch (error) {
      setErrors('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(process.env.settings, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccessDialogOpen(true);
      } else {
        setErrors('Failed to update config. Please try again.');
      }
    } catch (error) {
      setErrors('Failed to fetch data. Please try again.');
    }
  };

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
  };

  if (errors) {
    return <ErrorPage errorMessage={errors} />;
  }
  return (
    <Container sx={{ margin: '0px auto', width: { lg: '50svw' } }}>
      <Paper sx={{ padding: '20px', pt: 0, height: '100vh' }}>
        <Typography padding={4} pl={0} variant="h4">
          Configuration
        </Typography>
        {loading ? (
          <Grid item xs={6} lg={6} mt={15} display="flex" justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              name="git"
              label="Git"
              value={formData.git}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="access_token"
              label="Access Token"
              value={formData.access_token}
              onChange={handleChange}
              fullWidth
              sx={{ mt: 4 }}
            />
            <TextField
              name="url"
              label="URL"
              value={formData.url}
              onChange={handleChange}
              fullWidth
              sx={{ mt: 4 }}
            />
            <TextField
              name="PRcomment"
              label="PR Comment"
              value={formData.PRcomment}
              onChange={handleChange}
              fullWidth
              sx={{ mt: 4 }}
            />
            <TextField
              name="blockPR"
              label="Block PR"
              type="boolean"
              value={formData.blockPR}
              onChange={handleChange}
              fullWidth
              sx={{ mt: 4 }}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 4 }}>
              Submit
            </Button>
          </form>
        )}
        <Dialog open={isSuccessDialogOpen} onClose={handleCloseSuccessDialog}>
          <DialogTitle>Success</DialogTitle>
          <DialogContent>
            <Typography variant="body1">Data updated successfully!</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSuccessDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default SettingPage;
