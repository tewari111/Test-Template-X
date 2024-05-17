import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import {
  Box,
  Card,
  Grid,
  Menu,
  Button,
  Dialog,
  MenuItem,
  Checkbox,
  FormGroup,
  Container,
  Typography,
  IconButton,
  CardContent,
  DialogTitle,
  DialogActions,
  FormControlLabel,
} from '@mui/material';

import Iconify from 'src/components/iconify';

import ErrorPage from 'src/sections/error/ErrorPage';
// import Iconify from 'src/components/iconify';

const ShowSecrets = () => {
  const [secretsData, setSecretsData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  // const [OrgScopeValue, setOrgScopeValue] = useState();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const [checkboxData, setCheckboxData] = useState([]);
  const [repoName, setRepoName] = useState();
  const [visibility, setVisibility] = useState('hidden');
  const [secretValue, setSecret] = useState();
  const { id, startIndex, endIndex } = useParams();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.getOrgScan}?start_index=${startIndex}&end_index=${endIndex}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        setSecretsData(data.repositories);
      } catch (error) {
        setErrors('Field to fetch secrets!');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startIndex, endIndex, accessToken]);

  const setWhitelistSecrets = async (result) => {
    console.log('result: ', result);
    try {
      const response = await fetch(process.env.setWhitelistSecrets, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(result),
      });

      if (response.ok) {
        console.log('Whitelist secrets set successfully');
        const data = await response.json();
        console.log(data);
      } else if (response.status === 401) {
        setErrors("you don't have access");
      } else if (response.status === 400) {
        setErrors('you entred uncorrected data');
      } else {
        setErrors('Field to do it. please tray agian');
      }
    } catch (error) {
      setErrors('Error setting whitelist secrets:');
    }
  };

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

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handelCloseDialog = () => {
    setOpenDialog(false);
  };

  function setValue({ varified }) {
    if (checkboxData.length !== 0) {
      const result = checkboxData.map((item) => ({
        Secret: item,
        OrgScope: varified,
        Repository: repoName,
      }));
      setWhitelistSecrets(result);
    } else {
      const result = [
        {
          Secret: secretValue,
          OrgScope: varified,
          Repository: repoName,
        },
      ];
      setWhitelistSecrets(result);
    }
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
    <Container>
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
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>
          <Button onClick={handleOpenDialog} startIcon={<Iconify icon="ri:checkbox-circle-fill" />}>
            Whitelist
          </Button>
        </MenuItem>
      </Menu>
      <Dialog open={openDialog}>
        <DialogTitle>Do you want to this white list for entire org?</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setValue({ varified: true });
              handelCloseDialog();
            }}
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              setValue({ varified: false });
              handelCloseDialog();
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container>
        {loading ? (
          <Grid container textAlign="center" justifyContent="center">
            <CircularProgress sx={{ mr: 10 }} />
          </Grid>
        ) : (
          <>
            {secretsData.map((repository, index) => (
              <Grid item xs={12} md={12} key={index}>
                {Number(id) === Number(index) && (
                  <Grid>
                    <Typography
                      variant="h4"
                      component="h1"
                      sx={{ display: repository.secrets.length === 0 ? 'none' : 'block' }}
                      padding="5px"
                      ml={7}
                      mt={1}
                    >
                      {repository.repository} Secrets
                    </Typography>
                    <CardContent>
                      <Grid container spacing={2}>
                        {repository.secrets.map((secret, secretIndex) => (
                          <Grid item xs={12} key={secretIndex} alignItems="start" display="flex">
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    value={secret.Match}
                                    onChange={(event) => {
                                      setRepoName(repository.repository);
                                      handleCheckboxChange(event);
                                    }}
                                  />
                                }
                              />
                            </FormGroup>
                            <Card variant="outlined">
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="subtitle1">
                                    Description: {secret.Description}
                                  </Typography>
                                  <IconButton
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={(event) => {
                                      handleClick(event);
                                      setRepoName(repository.repository);
                                      setSecret(secret.Match);
                                    }}
                                    sx={{ height: '20px' }}
                                  >
                                    <Iconify icon="eva:more-vertical-fill" />
                                  </IconButton>
                                </Box>
                                <Typography variant="body2">Author: {secret.Author}</Typography>
                                <Typography variant="body2">Commit: {secret.Commit}</Typography>
                                <Typography variant="body2">Date: {secret.Date}</Typography>
                                <Typography variant="body2">Email: {secret.Email}</Typography>
                                <Typography variant="body2">
                                  EndColumn: {secret.EndColumn}
                                </Typography>
                                <Typography variant="body2">EndLine: {secret.EndLine}</Typography>
                                <Typography variant="body2">Entropy: {secret.Entropy}</Typography>
                                <Typography variant="body2">
                                  Fingerprint: {secret.Fingerprint}
                                </Typography>
                                <Typography variant="body2">
                                  Match: {secret.Match.slice(0, 100)}
                                </Typography>
                                <Typography variant="body2">Message: {secret.Message}</Typography>
                                <Typography variant="body2">RuleID: {secret.RuleID}</Typography>
                                <Typography variant="body2">
                                  StartColumn: {secret.StartColumn}
                                </Typography>
                                <Typography variant="body2">
                                  StartLine: {secret.StartLine}
                                </Typography>
                                <Typography variant="body2">
                                  SymlinkFile : {secret.SymlinkFile}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Grid>
                )}
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </Container>
  );
};

export default ShowSecrets;
