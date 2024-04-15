import yaml from 'yaml';
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import {
  Box,
  Card,
  Grid,
  Menu,
  Button,
  Dialog,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  CardContent,
  DialogTitle,
  DialogActions,
  FormControlLabel,
} from '@mui/material';

import Iconify from 'src/components/iconify/iconify';

import ErrorPage from 'src/sections/error/ErrorPage';

function FetchScanFile() {
  const [fechedData, setFetchedData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [repoName, setRepoName] = useState();
  const [verified, setVerified] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [checkboxData, setCheckboxData] = useState([]);
  const [visibility, setVisibility] = useState('hidden');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  const [raw, setRaw] = useState('');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const dateOfScan = searchParams.get('date_of_scan');

  const trimed = dateOfScan.trim();
  const splited = trimed.split(' ');
  const updatedDate = `${splited[0]}%20${splited[1]}`;

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handelCloseDialog = () => {
    setOpenDialog(false);
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchScanFile = async () => {
      try {
        const response = await fetch(`${process.env.fetchScanFile}${updatedDate}`);
        const responseData = await response.text();
        const parsedData = yaml.parse(responseData);
        setFetchedData(parsedData);
      } catch (error) {
        setErrors('Field to fetch scan file. please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchScanFile();
  }, [updatedDate]);

  function setValue() {
    if (checkboxData.length !== 0) {
      const result = checkboxData.map((item) => ({
        Secret: item,
        OrgScope: verified,
        Repository: repoName,
      }));
      setWhitelistSecrets(result);
    } else {
      const result = [
        {
          Secret: raw,
          OrgScope: !verified,
          Repository: repoName,
        },
      ];

      setWhitelistSecrets(result);
    }
  }

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setVisibility('visible');
      setCheckboxData((prevData) => [...prevData, value]);
    } else {
      setCheckboxData((prevData) => prevData.filter((item) => item !== value));
      setVisibility('hidden');
    }
  };

  const setWhitelistSecrets = async (result) => {
    try {
      const response = await fetch(process.env.setWhitelistSecrets, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });

      if (response.ok) {
        console.log('Whitelist secrets set successfully');
        // const data = await response.json();
        handleClose();
      } else {
        console.error('Error setting whitelist secrets:', response.status, response.statusText);
      }
    } catch (error) {
      setErrors('Field to submit it. please try again.');
    }
  };

  function renderNestedValue1(nestedKey, nestedValue) {
    let content;
    if (nestedKey === 'Raw') {
      content = nestedValue.slice(0, 150);
    } else if (typeof nestedValue === 'boolean') {
      content = nestedValue.toString();
    } else {
      content = nestedValue;
    }
    return `${nestedKey}: ${content}`;
  }

  console.log('fechedData........', fechedData[0]);

  function renderNestedValue(nestedKey, nestedValue) {
    let content;
    if (nestedKey === 'Raw') {
      content = nestedValue.slice(0, 150);
    } else if (typeof nestedValue === 'boolean') {
      content = nestedValue.toString();
    } else {
      content = nestedValue;
    }
    return (
      <>
        {nestedKey}: {content}
      </>
    );
  }

  function renderValue(key, value) {
    let content;
    if (key === 'Raw') {
      content = value.slice(0, 150);
    } else if (typeof value === 'boolean') {
      content = value.toString();
    } else {
      content = value;
    }
    return (
      <Grid>
        {key}: {content}
      </Grid>
    );
  }

  if (errors) {
    return <ErrorPage errorMessage={errors} />;
  }

  if (loading) {
    return (
      <Grid item xs={6} lg={6} mt={20} display="flex" justifyContent="center">
        {' '}
        <CircularProgress />{' '}
      </Grid>
    );
  }

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        lg={12}
        bgcolor="lightblue"
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        padding="20px"
        visibility={visibility}
      >
        <Typography>{checkboxData.length} Selected</Typography>
        <Button
          startIcon={
            <Iconify icon="ri:checkbox-circle-fill" sx={{ mr: 2 }} onClick={handleOpenDialog} />
          }
        />
      </Grid>
      <Dialog open={openDialog}>
        <DialogTitle>Do you want to this white list for entire org?</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              verified(true);
              setValue();
              handelCloseDialog();
            }}
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              verified(false);
              setValue();
              handelCloseDialog();
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog}>
        <DialogTitle>Do you want to this white list for entire org?</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setVerified(true);
              setValue();
              handelCloseDialog();
            }}
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              setVerified(false);
              setValue();
              handelCloseDialog();
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Grid item lg={12}>
        <Typography variant="h6">ScanFile Data:</Typography>
        {fechedData[0] === 'File not found' ? (
          <Typography mt={10}>Ther is no data.</Typography>
        ) : (
          <>
            {fechedData.map((item, index) => (
              <Grid sx={{ display: 'flex' }}>
                <FormGroup sx={{ mt: 5 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={item.Raw}
                        onChange={(event) => {
                          setRepoName('');
                          handleCheckboxChange(event);
                        }}
                      />
                    }
                  />
                </FormGroup>
                <Card sx={{ mt: 4 }} key={index}>
                  <CardContent>
                    {Object.entries(item).map(([key, value]) => (
                      <Grid key={key}>
                        {value && typeof value === 'object' ? (
                          <Grid>
                            <Grid container display="flex" justifyContent="space-between">
                              <Typography variant="subtitle1" color="primary" paragraph>
                                {key}:
                              </Typography>
                              <Box>
                                <IconButton
                                  id="basic-button"
                                  aria-controls={open ? 'basic-menu' : undefined}
                                  aria-haspopup="true"
                                  aria-expanded={open ? 'true' : undefined}
                                  onClick={(event) => {
                                    handleClick(event);
                                  }}
                                  sx={{ height: '20px' }}
                                >
                                  <Iconify icon="eva:more-vertical-fill" />
                                </IconButton>

                                <Menu
                                  id="basic-menu"
                                  anchorEl={anchorEl}
                                  open={open}
                                  onClose={handleClose}
                                  MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                  }}
                                >
                                  <Button
                                    onClick={() => {
                                      setRaw(item.Raw);
                                      handleOpenDialog();
                                    }}
                                    startIcon={<Iconify icon="ri:checkbox-circle-fill" />}
                                    sx={{ margin: '10px' }}
                                  >
                                    Whitelist
                                  </Button>
                                </Menu>
                              </Box>
                            </Grid>
                            {Object.entries(value).map(([nestedKey, nestedValue]) => (
                              <Grid key={nestedKey}>
                                {nestedValue && typeof nestedValue === 'object' ? (
                                  <Grid>
                                    <Typography variant="subtitle2" color="textSecondary">
                                      {nestedKey}:
                                    </Typography>
                                    {Object.entries(nestedValue).map(([innerKey, innerValue]) => (
                                      <Grid key={innerKey}>
                                        {innerValue && typeof innerValue === 'object' ? (
                                          <Grid>
                                            <Typography variant="body2" component="div">
                                              {Object.entries(innerValue).map(
                                                ([subKey, subValue]) => (
                                                  <div key={subKey}>
                                                    {subKey}: {subValue}
                                                  </div>
                                                )
                                              )}
                                            </Typography>
                                          </Grid>
                                        ) : (
                                          <Grid key={nestedKey}>
                                            {renderNestedValue1(key, value)}
                                          </Grid>
                                        )}
                                      </Grid>
                                    ))}
                                  </Grid>
                                ) : (
                                  <Grid key={key}>{renderNestedValue(nestedKey, nestedValue)}</Grid>
                                )}
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <Grid key={key}>{renderValue(key, value)}</Grid>
                        )}
                      </Grid>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </Grid>
  );
}

export default FetchScanFile;
