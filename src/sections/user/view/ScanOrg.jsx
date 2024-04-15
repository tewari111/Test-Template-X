import React, { useState } from 'react';

import WarningIcon from '@mui/icons-material/Warning';
import {
  Box,
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import Iconify from 'src/components/iconify';

import ErrorPage from 'src/sections/error/ErrorPage';

function ScanOrg() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const fetchScanOrg = async () => {
    setLoading(true);
    try {
      const res = await fetch(process.env.scanOrg, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        // console.log('ressssssss: ', res);
      }
    } catch (error) {
      setErrors('Field to san org. Please try again later.');
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  if (errors) {
    return <ErrorPage errorMessage={errors} />;
  }
  return (
    <>
      <Dialog open={!!open} onClose={handleClose}>
        <Box sx={{ bgcolor: '	#ffcccb' }}>
          {loading ? (
            <Box sx={{ padding: '50px' }}>
              <CircularProgress />
            </Box>
          ) : (
            <DialogTitle sx={{ textAlign: 'center' }}>
              <WarningIcon sx={{ margin: '0px auto', color: 'rgb(150,0,0)' }} />
              <Typography>Do You Scan Entire Org Again?</Typography>
            </DialogTitle>
          )}
          <DialogActions>
            {loading ? (
              <Button
                onClick={() => {
                  handleClose();
                }}
              >
                Close
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    fetchScanOrg();
                  }}
                >
                  Yes
                </Button>
                <Button
                  onClick={() => {
                    handleClose();
                  }}
                >
                  No
                </Button>
              </>
            )}
          </DialogActions>
        </Box>
      </Dialog>
      <div>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpen}
        >
          Start Org Scan
        </Button>
      </div>
    </>
  );
}

export default ScanOrg;
