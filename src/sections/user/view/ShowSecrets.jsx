import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { Card, Grid, Container, Typography, CardContent } from '@mui/material';

const ShowSecrets = () => {
  const [secretsData, setSecretsData] = useState([]);

  const { id } = useParams();
  console.log('id: ', id);

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
    <Container sx={{ width: '100vw' }}>
      <Grid container spacing={2} width="100%">
        {secretsData.map((repository, index) => (
          <Grid item xs={12} md={6} key={index}>
            {Number(id) === Number(index) && (
              <Card sx={{ width: '60vw' }}>
                <CardContent>
                  <Typography variant="h5" component="h1" padding="10px">
                    {repository.repository}
                  </Typography>
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
                            <Typography variant="body2">File: {secret.File}</Typography>
                            <Typography variant="body2">Rule ID: {secret.RuleID}</Typography>
                            <Typography variant="body2">Secret: {secret.Secret}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ShowSecrets;
