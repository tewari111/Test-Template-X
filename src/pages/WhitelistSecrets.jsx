import React, { useState, useEffect } from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import ToggleButton from '@mui/material/ToggleButton';
import TableContainer from '@mui/material/TableContainer';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Grid, Button, Popover, MenuItem, IconButton, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

export default function WhitelistSecrets() {
  const [alignment, setAlignment] = useState('reposcope');
  const [fetchedData, setFetchedData] = useState([]);
  const [open, setOpen] = useState(null);
  const [secretKey, setSecretKey] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://65.1.132.241:8000/getWhitelistSecrets');
        if (res.ok) {
          const data = await res.json();
          setFetchedData(data);
        } else {
          console.error('Error occurred while fetching data');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleClick = async () => {
    fetch('http://65.1.132.241:8000/removeWhitelistSecrets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        removeWhitelistSecret: secretKey,
      }),
    })
      .then((response) => {
        if (response.ok) {
          handleCloseMenu();
          window.location.reload();
          return response.json();
        }
        return response;
      })
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleOpenMenu = async (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  // Check if mappedData is undefined and handle the condition
  let mappedData = [];
  if (alignment === 'orgscope' && fetchedData.orgscope) {
    mappedData = fetchedData.orgscope;
  } else if (alignment === 'reposcope' && fetchedData.reposcope) {
    mappedData = fetchedData.reposcope;
  }

  return (
    <Grid container sx={{ margin: '0px auto', ml: { xs: 15 }, width: { lg: '50svw' } }}>
      <Typography variant="h4">Whitelist Secrets</Typography>
      <Grid item lg={12} xs={12} textAlign="start" mb={4} mt={5}>
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="orgscope">Orgscope</ToggleButton>
          <ToggleButton value="reposcope">Reposcope</ToggleButton>
        </ToggleButtonGroup>
      </Grid>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 180 },
        }}
      >
        <MenuItem onClick={handleClick}>
          <Button startIcon={<Iconify icon="eva:trash-fill" sx={{ mr: 2 }} />}>
            Remove Whitelist
          </Button>
        </MenuItem>
      </Popover>
      <Grid item xs={8} lg={8}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Secret</TableCell>
                <TableCell>OrgScope</TableCell>
                <TableCell>Repository</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mappedData.map((item, i) => (
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={i}>
                  <TableCell>{item.Secret}</TableCell>
                  <TableCell>{String(item.OrgScope)}</TableCell>
                  <TableCell>{item.Repository}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(event) => {
                        handleOpenMenu(event);
                        setSecretKey(item.Secret);
                      }}
                    >
                      <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
