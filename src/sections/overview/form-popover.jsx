// import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
// import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

// import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

// import Iconify from 'src/components/iconify';

export default function FormView( {open, handleClose, handleInputChange, formData, handleSubmit } ) {
    const theme = useTheme();
  
    // const router = useRouter();
  
    // const [showPassword, setShowPassword] = useState(false);
    
    const renderForm = (
      <Dialog open={open} onclose={handleClose}>
        <DialogTitle>Schedule Scan</DialogTitle>
        <DialogContent>
        <Stack spacing={3}>
          <TextField 
          name="url" 
          label="Org URL" 
          type="text"
          fullWidth
          value={formData.url}
          onChange={handleInputChange}
          />
  
          <TextField
            name="password"
            label="Date"
            // type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {/* <IconButton onClick={() => setShowPassword(!showPassword)} edge="end"> */}
                    {/* <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} /> */}
                  {/* </IconButton> */}
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        {/* <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
          <Link variant="subtitle2" underline="hover">
          Forgot password?
          </Link>
        </Stack> */}
  
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="inherit"
          onClick={handleSubmit}
          >
          Start Scan
          </LoadingButton>
        </DialogContent>
      </Dialog>
    );
  
    return (
      <Box
        sx={{
          ...bgGradient({
            color: alpha(theme.palette.background.default, 0.9),
            imgUrl: '/assets/background/overlay_4.jpg',
          }),
          height: 1,
        }}
      >

        <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
          <Card
            sx={{
              p: 5,
              width: 1,
              maxWidth: 420,
            }}
          > 
            {renderForm}
          </Card>
        </Stack>
      </Box>
    );
  }

FormView.propTypes = {
    open: PropTypes.bool,
    formData: PropTypes.object,
    handleSubmit: PropTypes.func,
    handleClose: PropTypes.func,
    handleInputChange: PropTypes.func,
};
