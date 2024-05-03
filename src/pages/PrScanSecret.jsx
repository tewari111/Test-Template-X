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
  CircularProgress,
} from '@mui/material';

import ErrorPage from 'src/sections/error/ErrorPage';

import EditPrScan from './EditPrScan';

function PrScanSecret() {
  const [openDialog, setOpenDialog] = useState(false);
  const [fechedData, setFetchedData] = useState([]);
  // const [webHookData, setWebHookData] = useState([]);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const [formData, setFormData] = useState({
    git: '',
    scanType: '',
    PRcomment: '',
    blockPR: false,
    gitActions: [],
    targetRepos: [],
  });

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchPrScanSecret = async () => {
      try {
        const response = await fetch(process.env.prScanSecret, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          const res = responseData.scanData;
          res.sort((a, b) => new Date(b.date_of_scan) - new Date(a.date_of_scan));
          setFetchedData(res);

          if (res.git && res.scanType && res.PRcomment) {
            handleOpenDialog();
          } else {
            setOpenDialog(false);
          }
        }
      } catch (error) {
        setErrors('Field to fetch prScanSecret. Please try again later.');
        // Handle the error appropriately (e.g., show an error message to the user)
      } finally {
        setLoading(false);
      }
    };
    fetchPrScanSecret();
  }, [accessToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(process.env.webhookConfig, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setOpenDialog(false);
      } else {
        setOpenDialog(true);
      }
    } catch (error) {
      setErrors('Field to submit data. Please try again later.');
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

  if (errors) {
    return <ErrorPage errorMessage={errors} />;
  }
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
                  onKeyUp={handleEnterKeyPress}
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
      {loading ? (
        <Grid items xs={8} lg={8} mt={15} display="center" justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : (
        <Grid item lg={12}>
          {fechedData.map((item, i) => (
            <Card
              sx={{
                mt: 3,
                padding: '5px 10px',
                bgcolor: item.scan_result ? '#BDF5BD' : '#ffcccb',
                borderRadius: '10px',
              }}
              key={i}
            >
              <Grid container>
                <Grid item xs={2} md={2} sx={{ display: 'flex' }}>
                  <Typography sx={{ fontWeight: 'bold' }}>PR Link</Typography>
                </Grid>
                <Grid item xs={9} md={9} sx={{ display: 'flex' }}>
                  <a href={item.prLink}>{item.prLink}</a>
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
              {!item.scan_result ? (
                <Grid container>
                  <Grid item xs={2} md={2} sx={{ display: 'flex' }}>
                    <Typography sx={{ fontWeight: 'bold' }}>Secret File</Typography>
                  </Grid>
                  <Grid item xs={9} md={9} sx={{ display: 'flex' }}>
                    <a href={`${process.env.fetchScanFile}${item.date_of_scan}`}>
                      go to secret file
                    </a>
                  </Grid>
                </Grid>
              ) : (
                <Grid container>
                  <Grid item xs={2} md={2} sx={{ display: 'flex' }}>
                    <Typography sx={{ fontWeight: 'bold' }}>Date of Scan</Typography>
                  </Grid>
                  <Grid item xs={9} md={9} sx={{ display: 'flex' }}>
                    <Typography>{item.date_of_scan}</Typography>
                  </Grid>
                </Grid>
              )}
            </Card>
          ))}
        </Grid>
      )}
    </Grid>
  );
}

export default PrScanSecret;
