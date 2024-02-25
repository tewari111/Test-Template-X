import dayjs from 'dayjs';
import { useState } from 'react';
import PropTypes from 'prop-types';
// import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
// import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// import TextField from '@mui/material/TextField';
// import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
// import { alpha, useTheme } from '@mui/material/styles';
// import InputAdornment from '@mui/material/InputAdornment';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { useRouter } from 'src/routes/hooks';

// import { bgGradient } from 'src/theme/css';

// import Iconify from 'src/components/iconify';

export default function FormView( {open, handleClose, handleInputChange, formData, handleSubmit } ) {
    // const theme = useTheme();
  
    // const router = useRouter();
  
    // const [showPassword, setShowPassword] = useState(false);
    const [value, setValue] = useState(dayjs().add(0,'day'));
    const [time, setTime]=useState();

    const renderForm = (
      <Dialog open={open} onclose={handleClose}>
        <DialogTitle>Schedule Scan</DialogTitle>
        <DialogContent>
        <Stack spacing={3}>
          {/* <TextField 
          name="email" 
          label="email" 
          type="text"
          fullWidth
          value={formData.url}
          onChange={handleInputChange}
          />
   */}
          {/* <TextField
            name="password"
            label="Date"
            // type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end"> */}
                  {/* <IconButton onClick={() => setShowPassword(!showPassword)} edge="end"> */}
                    {/* <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} /> */}
                  {/* </IconButton> */}
                {/* </InputAdornment>
              ),
            }}
          /> */}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
              <DatePicker
              label="Select Date"
              value={value}
              onChange={(newValue) => setValue(newValue)}
              disablePast
               />
            </DemoContainer>
            <DemoContainer components={['TimePicker', 'TimePicker']}>
              <TimePicker
                label="Time picker"
                value={time}
                onChange={(newValue) => setTime(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="inherit"
          onClick={handleSubmit}
          >
          Schedule Scan
          </LoadingButton>
        </Stack>
        {/* <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
          <Link variant="subtitle2" underline="hover">
          Forgot password?
          </Link>
        </Stack> */}
  
        </DialogContent>
      </Dialog>
    );
  
    return (
      // <Box
      //   sx={{
      //     ...bgGradient({
      //       color: alpha(theme.palette.background.default, 0.9),
      //       imgUrl: '/assets/background/overlay_4.jpg',
      //     }),
      //     height: 1,
      //   }}
      // >

        <Stack alignItems="center" justifyContent="centre" sx={{ height: 1 }}>
          {/* <Card
            sx={{
              p: 5,
              width: 1,
              maxWidth: 420,
            }}
          >  */}
            {renderForm}
          {/* </Card> */}
        </Stack>
      // </Box>
    );
  }

FormView.propTypes = {
    open: PropTypes.bool,
    formData: PropTypes.object,
    handleSubmit: PropTypes.func,
    handleClose: PropTypes.func,
    handleInputChange: PropTypes.func,
};
