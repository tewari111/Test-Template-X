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

// import Label from 'src/components/label';

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
  id,
  commits,
  handleClick,
  
}) {
  const [open, setOpen] = useState(null);
  // const [secret, setData]=useState(null);

  // const openDialog= () => {
  //   setSecret(true);
  // }

  // const closeDialog=() => {
  //   setSecret(false)
  // }
  const navigate = useNavigate();
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
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
                navigate(`/secrets/${id}`);
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
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          re-scan
        </MenuItem>
      </Popover>
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
  // status: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
