import React, { useState, useEffect } from 'react';

import {
  Dialog,
  Button,
  TextField,
  Container,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const SettingPage = () => {
  const [formData, setFormData] = useState({
    git: '',
    access_token: '',
    url: '',
    PRcomment: '',
    blockPR: false,
  });

  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://65.1.132.241:8000/settings');
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error(error);
    }
  };

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
      const response = await fetch('http://65.1.132.241:8000/settings', {
        method: 'POST', // or 'PUT' if applicable
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // add action to localstorage
        const currentTime = new Date().toLocaleTimeString();
        const currentDate = new Date().toLocaleDateString();
        const newMessageEntry = `Configs updated: ${currentDate} ${currentTime}`;

        // Retrieve the existing messages array from localStorage
        const storedMessages = localStorage.getItem('postRequestMessages');
        const messages = storedMessages ? JSON.parse(storedMessages) : [];

        const updatedMessages = [...messages, newMessageEntry];
        localStorage.setItem('postRequestMessages', JSON.stringify(updatedMessages));

        setIsSuccessDialogOpen(true);
      } else {
        console.error('Failed to update data');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
  };

  return (
    <Container sx={{ margin: '0px auto', width: { lg: '50svw' } }}>
      <Typography padding={4} pl={0} variant="h4">
        Configuration
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField name="git" label="Git" value={formData.git} onChange={handleChange} fullWidth />
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
    </Container>
  );
};

export default SettingPage;
