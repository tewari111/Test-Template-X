import { useState } from 'react';
import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  onKeyUp,
  selected,
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const reScan = async () => {
    handleOpenDialog();
    fetch(process.env.scanRepo, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(selected),
    })
      .then((response) => {
        if (response.ok) {
          setOpenDialog(false);
          return response.json();
        }

        return response;
      })
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handelCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Toolbar
        sx={{
          height: 96,
          display: 'flex',
          justifyContent: 'space-between',
          p: (theme) => theme.spacing(0, 1, 0, 3),
          ...(numSelected > 0 && {
            color: 'primary.main',
            bgcolor: 'primary.lighter',
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography component="div" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <OutlinedInput
            value={filterName}
            onChange={onFilterName}
            onKeyUp={onKeyUp}
            placeholder="Search and sort feature.."
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: 'text.disabled', width: 30, height: 20 }}
                />
              </InputAdornment>
            }
          />
        )}

        {numSelected > 0 ? (
          <Tooltip onClick={reScan} title="Re-Scan">
            <IconButton>
              <Iconify icon="eva:refresh-fill" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <Iconify icon="ic:round-filter-list" />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>

      <Dialog open={!!openDialog} onClose={handelCloseDialog}>
        <DialogTitle>
          Secret Scan started for
          <ul>
            {selected.map((item, i) => (
              <li>{item}</li>
            ))}
          </ul>
        </DialogTitle>
        <DialogActions>
          <Button onClick={handelCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  selected: PropTypes.array,
  onKeyUp: PropTypes.func,
};
