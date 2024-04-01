import React, { useState, useEffect } from 'react';

import {
  Box,
  Chip,
  Grid,
  Button,
  Dialog,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
} from '@mui/material';

function EditPrScan() {
  const [openDialog, setOpenDialog] = useState(false);
  //   const [fechedData, setFetchedData] = useState([]);

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
          setFormData(responseData);
          setOptions(responseData.targetRepos);
        }
      } catch (error) {
        console.error(error);
        // Handle the error appropriately (e.g., show an error message to the user)
      }
    };
    webHookConfig();
  }, [options]);

  useEffect(() => {
    const fetchPrScanSecret = async () => {
      try {
        const response = await fetch('http://65.1.132.241:8000/prScanSecret');
        if (response.ok) {
          const responseData = await response.json();
          setFormData(responseData.scanData);
        }
      } catch (error) {
        console.error(error);
        // Handle the error appropriately (e.g., show an error message to the user)
      }
    };
    fetchPrScanSecret();
  }, []);

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
    console.log('value: ', value);
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
          <DialogTitle>Edit PR Config</DialogTitle>
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
                  {options.length > 1 ? (
                    options.map((option, index) => (
                      <Chip
                        key={index}
                        label={option}
                        onDelete={() => handleRemoveOption(option)}
                        sx={{ margin: 0.5 }}
                      />
                    ))
                  ) : (
                    <Chip label={options} onDelete={() => setOptions('')} sx={{ margin: 0.5 }} />
                  )}
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
      <Button onClick={handleOpenDialog}>Edit PR Config</Button>
    </Grid>
  );
}

export default EditPrScan;
