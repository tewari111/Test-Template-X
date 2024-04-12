import React, { useState } from 'react';

import WarningIcon from '@mui/icons-material/Warning';
import { Box, Dialog, Button, Typography, DialogTitle, DialogActions } from '@mui/material';

import Iconify from 'src/components/iconify';

function ScanOrg() {
  const [open, setOpen] = useState(false);
  const fetchScanOrg = async () => {
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
      console.error(error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    fetchScanOrg();
    setOpen(false);
  };

  return (
    <>
      <Dialog open={!!open} onClose={handleClose}>
        <Box sx={{ bgcolor: '	#ffcccb' }}>
          <DialogTitle sx={{ textAlign: 'center' }}>
            <WarningIcon sx={{ margin: '0px auto', color: 'rgb(150,0,0)' }} />
            <Typography>Do You Scan Entire Org Again?</Typography>
          </DialogTitle>

          <DialogActions>
            <Button
              onClick={() => {
                fetchScanOrg();
                handleClose();
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
