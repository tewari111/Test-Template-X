import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { Card, Grid, Container, Typography, CardContent } from '@mui/material';

const ShowSecrets = () => {
  const [secretsData, setSecretsData] = useState([]);
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

  return (
    <Container>
      <Grid container spacing={2}>
        {secretsData.map((repository, index) => (
          <Grid item xs={12} md={6} key={index}>
            {Number(id) === Number(index) && (
              <Grid sx={{ width: '70vw' }}>
                <Typography variant="h4" component="h1" padding="5px" ml={1} mt={1}>
                  {repository.repository} Secretes
                </Typography>
                <CardContent>
                  <Grid container spacing={2}>
                    {repository.secrets.map((secret, secretIndex) => (
                      <Grid item xs={12} key={secretIndex}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle1">
                              Description: {secret.Description}
                            </Typography>
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
