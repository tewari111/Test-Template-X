import yaml from 'yaml';
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { Card, Grid, Typography, CardContent } from '@mui/material';

function FetchScanFile() {
  const [fechedData, setFetchedData] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const dateOfScan = searchParams.get('date_of_scan');

  const trimed = dateOfScan.trim();
  const splited = trimed.split(' ');
  const updatedDate = `${splited[0]}%20${splited[1]}`;

  console.log('URL: ', updatedDate);

  useEffect(() => {
    const fetchScanFile = async () => {
      try {
        const response = await fetch(
          `http://65.1.132.241:8000/fetchScanFile?date_of_scan=${updatedDate}`
        );
        const responseData = await response.text();
        const parsedData = yaml.parse(responseData);
        setFetchedData(parsedData);
      } catch (error) {
        console.error(error);
        // Handle the error appropriately (e.g., show an error message to the user)
      }
    };

    fetchScanFile();
  }, [updatedDate]);

  return (
    <Grid container>
      <Grid item lg={12}>
        <Typography variant="h6">ScanFile Data:</Typography>
        {fechedData.map((item, index) => (
          <Card sx={{ mt: 4 }} key={index}>
            <CardContent>
              {Object.entries(item).map(([key, value]) => (
                <Grid key={key}>
                  {value && typeof value === 'object' ? (
                    <Grid>
                      <Typography variant="subtitle1" color="primary" paragraph>
                        {key}:
                      </Typography>
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
                                        {Object.entries(innerValue).map(([subKey, subValue]) => (
                                          <div key={subKey}>
                                            {subKey}: {subValue}
                                          </div>
                                        ))}
                                      </Typography>
                                    </Grid>
                                  ) : (
                                    <Grid>
                                      {innerKey}:{' '}
                                      {innerKey === 'Raw'
                                        ? innerValue.slice(0, 150)
                                        : typeof innerValue === 'boolean'
                                        ? innerValue.toString()
                                        : innerValue}
                                    </Grid>
                                  )}
                                </Grid>
                              ))}
                            </Grid>
                          ) : (
                            <Grid>
                              {nestedKey}:{' '}

                              {nestedKey === 'Raw'

                                ? nestedValue.slice(0, 150)

                                : typeof nestedValue === 'boolean'

                                ? nestedValue.toString()

                                : nestedValue}

                            </Grid>
                          )}
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Grid>
                      {key}:{' '}

                      {key === 'Raw'

                        ? value.slice(0, 150)

                        : typeof value === 'boolean'

                        ? value.toString()

                        :value

                      }
                    </Grid>
                  )}
                </Grid>
              ))}
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
}

export default FetchScanFile;
