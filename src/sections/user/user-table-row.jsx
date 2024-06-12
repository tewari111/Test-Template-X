import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Dialog, DialogTitle, DialogActions } from '@mui/material';

import Iconify from 'src/components/iconify';

// import SecretDialog from './user-secret-dialog';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  name,
  avatarUrl,
  secrets,
  show,
  // status,
  startIndex,
  endIndex,
  id,
  commits,
  handleClick,
}) {
  const [open, setOpen] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  // const [secret, setData]=useState(null);
  const navigate = useNavigate();
  const reScan = async () => {
    const accessToken = localStorage.getItem('accessToken');
    handleOpenDialog();
    fetch(process.env.scanRepo, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(Array(name)),
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

  const handleOpenMenu = async (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handelCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      {/* <SecretDialog open={openDialog} secret={secret} handleClose={closeDialog}/> */}

      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{secrets}</TableCell>

        <TableCell>
          <Link underline="hover" sx={{ my: 3 }}>
            <Button
              onClick={() => {
                navigate(`/secrets/${id}/${startIndex}/${endIndex}/${name}`);
              }}
            >
              {show}
            </Button>
          </Link>
        </TableCell>

        {/* <TableCell>{commits}</TableCell> */}
        <TableCell align="center">{commits}</TableCell>

        {/* <TableCell>
          <Label color={(status === 'banned' && 'error') || 'success'}>{status}</Label>
        </TableCell> */}

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Button startIcon={<Iconify icon="eva:refresh-fill" sx={{ mr: 2 }} />} onClick={reScan}>
            Re-Scan
          </Button>
        </MenuItem>
      </Popover>

      <Dialog open={!!openDialog} onClose={handelCloseDialog}>
        <DialogTitle>Org scan started for {name}</DialogTitle>
        <DialogActions>
          <Button onClick={handelCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  secrets: PropTypes.any,
  handleClick: PropTypes.func,
  commits: PropTypes.any,
  name: PropTypes.any,
  show: PropTypes.any,
  selected: PropTypes.any,
  startIndex: PropTypes.number,
  endIndex: PropTypes.number,
  // status: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
