import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Grid,
  Menu,
  Button,
  MenuItem,
  Checkbox,
  FormGroup,
  Container,
  Typography,
  IconButton,
  CardContent,
  FormControlLabel,
} from '@mui/material';

import Iconify from 'src/components/iconify';
// import Iconify from 'src/components/iconify';

const ShowSecrets = () => {
  const [secretsData, setSecretsData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://65.1.132.241:8000/getOrgScan');
        const data = await response.json();
        setSecretsData(data.repositories);
      } catch (error) {
        console.error('Error fetching secrets:', error);
      }
    };

    fetchData();
  }, []);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container>
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
          <Button startIcon={<Iconify icon="eva:refresh-fill" sx={{ mr: 2 }} />}>Re-Scan</Button>
        </MenuItem>
      </Menu>
      <Grid>
        {secretsData.map((repository, index) => (
          <Grid item xs={12} md={6} key={index}>
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
                          <FormControlLabel control={<Checkbox />} />
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
                                onClick={handleClick}
                                sx={{ height: '20px' }}
                              >
                                <Iconify icon="eva:more-vertical-fill" />
                              </IconButton>
                            </Box>
                            <Typography variant="body2">Author: {secret.Author}</Typography>
                            <Typography variant="body2">Commit: {secret.Commit}</Typography>
                            <Typography variant="body2">Date: {secret.Date}</Typography>
                            <Typography variant="body2">Email: {secret.Email}</Typography>
                            <Typography variant="body2">EndColumn: {secret.EndColumn}</Typography>
                            <Typography variant="body2">EndLine: {secret.EndLine}</Typography>
                            <Typography variant="body2">Entropy: {secret.Entropy}</Typography>
                            <Typography variant="body2">
                              Fingerprint: {secret.Fingerprint}
                            </Typography>
                            <Typography variant="body2">Match: {secret.Match}</Typography>
                            <Typography variant="body2">Message: {secret.Message}</Typography>
                            <Typography variant="body2">RuleID: {secret.RuleID}</Typography>
                            <Typography variant="body2">
                              StartColumn: {secret.StartColumn}
                            </Typography>
                            <Typography variant="body2">StartLine: {secret.StartLine}</Typography>
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
      </Grid>
    </Container>
  );
};

export default ShowSecrets;
