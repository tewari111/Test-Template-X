import React, { useState, useEffect } from 'react';

import {
  Box,
  Chip,
  Card,
  Grid,
  Button,
  Dialog,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
} from '@mui/material';

import EditPrScan from './EditPrScan';

function PrScanSecret() {
  const [openDialog, setOpenDialog] = useState(false);
  const [fechedData, setFetchedData] = useState([]);
  const [webHookData, setWebHookData] = useState([]);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');

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
      handleOpenDialog();
    } else {
      setOpenDialog(false);
    }
  }, [webHookData.git, webHookData.scanType, webHookData.PRcomment]);

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

  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      setOptions([...options, inputValue.trim()]);
      setInputValue('');
      event.preventDefault();
    }
  };

  const handleRemoveOption = (option) => {
    setOptions(options.filter((item) => item !== option));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'targetRepos') {
      setInputValue(event.target.value);
      const selectedOptions = options;

      setFormData((prevData) => ({
        ...prevData,
        [name]: selectedOptions,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
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
          <DialogTitle>PR Config</DialogTitle>
          <DialogContent>
            <form style={{ mt: 1 }} onSubmit={handleSubmit}>
              <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                <InputLabel id="demo-simple-select-label">Git</InputLabel>
                <Select label="Git" name="git" value={formData.git} onChange={handleChange}>
                  <MenuItem value="github" selected>
                    Github
                  </MenuItem>
                  <MenuItem value="Bitbucket">Bitbucket</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small" sx={{ mt: 3 }}>
                <InputLabel id="demo-simple-select-label">Scan Type</InputLabel>
                <Select
                  label="Scan Type"
                  name="scanType"
                  value={formData.scanType}
                  onChange={handleChange}
                >
                  <MenuItem value="Loose" selected>
                    Loose
                  </MenuItem>
                  <MenuItem value="Aggressive">Aggressive</MenuItem>
                </Select>
              </FormControl>
              <TextField
                size="small"
                name="PRcomment"
                label="PR Comment"
                value={formData.PRcomment}
                onChange={handleChange}
                fullWidth
                sx={{ mt: 3 }}
              />

              <FormControl fullWidth size="small" sx={{ mt: 3 }}>
                <InputLabel id="demo-simple-select-label">Block PR</InputLabel>
                <Select
                  label="Block PR"
                  name="blockPR"
                  value={formData.blockPR}
                  onChange={handleChange}
                >
                  <MenuItem value="true" selected>
                    true
                  </MenuItem>
                  <MenuItem value="false">false</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" sx={{ mt: 3 }}>
                <InputLabel id="demo-simple-select-label">Git Actions</InputLabel>
                <Select
                  label="Git Actions"
                  name="gitActions"
                  value={formData.gitActions}
                  onChange={handleChange}
                  multiple
                >
                  <MenuItem value="create" selected>
                    create
                  </MenuItem>
                  <MenuItem value="update">update</MenuItem>
                  <MenuItem value="reopen">reopen</MenuItem>
                </Select>
              </FormControl>

              <Grid container>
                <TextField
                  name="targetRepos"
                  label="Target Repos"
                  value={inputValue}
                  onChange={handleChange}
                  onKeyPress={handleEnterKeyPress}
                  fullWidth
                  margin="normal"
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {options.map((option, index) => (
                    <Chip
                      key={index}
                      label={option}
                      onDelete={() => handleRemoveOption(option)}
                      sx={{ margin: 0.5 }}
                    />
                  ))}
                </Box>
              </Grid>

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
        <Typography>PR Scan History</Typography>
        <Box>
          <EditPrScan />
        </Box>
      </Grid>
      <Grid item lg={12}>
        {fechedData.map((item, i) => (
          <Card
            sx={{ mt: 3, padding: '10px', bgcolor: item.scan_result ? '#BDF5BD' : '#ffcccb' }}
            key={i}
          >
            <Grid container>
              <Grid item xs={2} md={2} sx={{ display: 'flex' }}>
                <Typography sx={{ fontWeight: 'bold' }}>PR Link</Typography>
              </Grid>
              <Grid item xs={9} md={9} sx={{ display: 'flex' }}>
                <Typography>{item.prLink}</Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={2} md={2} sx={{ display: 'flex' }}>
                <Typography sx={{ fontWeight: 'bold' }}>Repo Name</Typography>
              </Grid>
              <Grid item xs={9} md={9} sx={{ display: 'flex' }}>
                <Typography>{item.repoName}</Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={2} md={2} sx={{ display: 'flex' }}>
                <Typography sx={{ fontWeight: 'bold' }}>Secret No</Typography>
              </Grid>
              <Grid item xs={9} md={9} sx={{ display: 'flex' }}>
                <Typography>{item.secret_no}</Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={2} md={2} sx={{ display: 'flex' }}>
                <Typography sx={{ fontWeight: 'bold' }}>Secrets Link</Typography>
              </Grid>
              <Grid item xs={9} md={9} sx={{ display: 'flex' }}>
                <Typography>{item.secrets_link}</Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={2} md={2} sx={{ display: 'flex' }}>
                <Typography sx={{ fontWeight: 'bold' }}>Date of Scan</Typography>
              </Grid>
              <Grid item xs={9} md={9} sx={{ display: 'flex' }}>
                <Typography>{item.date_of_scan}</Typography>
              </Grid>
            </Grid>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
}

export default PrScanSecret;
