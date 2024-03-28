import React, { useState, useEffect } from 'react';

import {
  Card,
  Grid,
  Button,
  Dialog,
  TextField,
  Typography,
  CardContent,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

function PrScanSecret() {
  const [openDialog, setOpenDialog] = useState(false);
  const [fechedData, setFetchedData] = useState([]);
  const [webHookData, setWebHookData] = useState([]);
  const [formData, setFormData] = useState({
    git: '',
    scanType: '',
    PRcomment: '',
    blockPR: false,
    gitActions: [],
    targetRepos: [],
  });

  useEffect(() => {
    const webHookConfig = async () => {
      try {
        const response = await fetch('http://65.1.132.241:8000/webhookConfig');
        if (response.ok) {
          const responseData = await response.json();
          setWebHookData(responseData);
        }
      } catch (error) {
        console.error(error);
        // Handle the error appropriately (e.g., show an error message to the user)
      }
    };
    webHookConfig();
  }, []);

  useEffect(() => {
    const fetchPrScanSecret = async () => {
      try {
        const response = await fetch('http://65.1.132.241:8000/prScanSecret');
        if (response.ok) {
          const responseData = await response.json();
          setFetchedData(responseData.scanData);
        }
      } catch (error) {
        console.error(error);
        // Handle the error appropriately (e.g., show an error message to the user)
      }
    };
    fetchPrScanSecret();
  }, []);

  useEffect(() => {
    if (!(webHookData.git && webHookData.scanType && webHookData.PRcomment)) {
      console.log('trued: ');
      setOpenDialog(true);
    } else {
      setOpenDialog(false);
    }
  }, [webHookData.git, webHookData.scanType, webHookData.PRcomment]);

  console.log('Test: ', formData);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'targetRepos') {
      const selectedOptions = [value];

      setFormData((prevData) => ({
        ...prevData,
        [name]: selectedOptions,
      }));
    } else if (name === 'gitActions') {
      const selectedOptions = [value];

      setFormData((prevData) => ({
        ...prevData,
        [name]: selectedOptions,
      }));
    } else if (name === 'blockPR') {
      const checkboxValue = event.target.checked;

      setFormData((prevData) => ({
        ...prevData,
        [name]: checkboxValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://65.1.132.241:8000/webhookConfig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setOpenDialog(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handelCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Grid container>
      <Grid>
        <Dialog open={openDialog}>
          <DialogTitle>Test Dailog</DialogTitle>
          <DialogContent>
            <form style={{ mt: 1 }} onSubmit={handleSubmit}>
              <TextField
                size="small"
                name="git"
                label="git"
                value={formData.git}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                size="small"
                name="scanType"
                label="scanType"
                value={formData.scanType}
                onChange={handleChange}
                fullWidth
                sx={{ mt: 3 }}
              />
              <TextField
                size="small"
                name="PRcomment"
                label="PRcomment"
                value={formData.PRcomment}
                onChange={handleChange}
                fullWidth
                sx={{ mt: 3 }}
              />
              <TextField
                size="small"
                name="blockPR"
                label="blockPR"
                value={formData.blockPR}
                onChange={handleChange}
                fullWidth
                sx={{ mt: 3 }}
              />
              <TextField
                size="small"
                name="gitActions"
                label="gitActions"
                type="boolean"
                value={formData.gitActions}
                onChange={handleChange}
                fullWidth
                sx={{ mt: 3 }}
              />

              <TextField
                size="small"
                name="targetRepos"
                label="targetRepos"
                type="boolean"
                value={formData.targetRepos}
                onChange={handleChange}
                fullWidth
                sx={{ mt: 3 }}
              />

              <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
                Submit
              </Button>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handelCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <Grid item xs={12} lg={12} display="flex" justifyContent="space-between" alignItems="center">
        <Typography>PrScanSecret page</Typography>
        <Button onClick={handleOpenDialog}>Edit PreScanSecret</Button>
      </Grid>
      <Grid item lg={12}>
        {fechedData.map((item, i) => (
          <Card sx={{ mt: 3 }} key={i}>
            <CardContent>
              <Typography>date_of_scan: {item.date_of_scan}</Typography>
              <Typography>prLink: {item.prLink}</Typography>
              <Typography>repoName: {item.repoName}</Typography>
              <Typography>dscan_result: {item.scan_result.toString()}</Typography>
              <Typography>secret_no: {item.secret_no}</Typography>
              <Typography>secrets_link: {item.secrets_link}</Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
}

export default PrScanSecret;
