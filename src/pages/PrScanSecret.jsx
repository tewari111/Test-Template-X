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

  useEffect(() => {
    const fetchPrScanSecret = async () => {
      try {
        const response = await fetch('http://65.1.132.241:8000/prScanSecret');
        if (response.ok) {
          const responseData = await response.json();
          if (responseData.length === 0) {
            handleOpenDialog();
          } else {
            setFetchedData(responseData.scanData);
          }
        }
      } catch (error) {
        console.error(error);
        // Handle the error appropriately (e.g., show an error message to the user)
      }
    };
    fetchPrScanSecret();
  }, []);
  console.log('fechedData: ', fechedData);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handelCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Grid container>
      <Grid>
        <Typography>PrScanSecret page</Typography>
        <Dialog open={openDialog}>
          <DialogTitle>Test Dailog</DialogTitle>
          <DialogContent>
            <form style={{ mt: 1 }}>
              <TextField
                size="small"
                name="git"
                label="git"
                // value={formData.git}
                // onChange={git}
                fullWidth
              />
              <TextField
                size="small"
                name="scanType"
                label="scanType"
                // value={formData.access_token}
                // onChange={handleChange}
                fullWidth
                sx={{ mt: 3 }}
              />
              <TextField
                size="small"
                name="PRcomment"
                label="PRcomment"
                // value={formData.url}
                // onChange={handleChange}
                fullWidth
                sx={{ mt: 3 }}
              />
              <TextField
                size="small"
                name="blockPR"
                label="blockPR"
                // value={formData.PRcomment}
                // onChange={handleChange}
                fullWidth
                sx={{ mt: 3 }}
              />
              <TextField
                size="small"
                name="gitActions"
                label="gitActions"
                type="boolean"
                // value={formData.blockPR}
                // onChange={handleChange}
                fullWidth
                sx={{ mt: 3 }}
              />

              <TextField
                size="small"
                name="targetRepos"
                label="targetRepos"
                type="boolean"
                // value={formData.blockPR}
                // onChange={handleChange}
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
        <Button onClick={handleOpenDialog}>openDialog</Button>
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
