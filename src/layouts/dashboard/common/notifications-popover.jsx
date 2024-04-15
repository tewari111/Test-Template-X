import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Grid, Alert, AlertTitle, Pagination } from '@mui/material';

import { fToNow } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const [open, setOpen] = useState(null);
  const [logs, setLogs] = useState([]);
  const [errors, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    fetchData(value);
  };

  const fetchData = async (currentPage = 1) => {
    try {
      const response = await fetch(
        `${process.env.getLogs}?start_index=${(currentPage - 1) * 10}&end_index=${currentPage * 10}`
      );
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
        setTotalPages(Math.ceil(data.total_logs / 10));
      } else {
        throw new Error('Failed to fetch logs');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  function formatTimeAgo(timestamp) {
    const date = new Date(timestamp * 1000);
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen}>
        <Badge color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Your History</Typography>
            {errors ? (
              <Typography color="red">{errors}</Typography>
            ) : (
              <>
                {loading ? (
                  <Grid container display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress />
                  </Grid>
                ) : (
                  <Grid container>
                    {logs.reverse(c).map((log, i) => (
                      <Grid item lg={12} xss={12} key={i}>
                        {log.request_method === 'POST' ? (
                          <Alert
                            severity="success"
                            sx={{ mt: 1, width: '100%', bgcolor: '#00008B', color: 'white' }}
                          >
                            <AlertTitle>{formatTimeAgo(log.request_time)}</AlertTitle>
                            Configs updated
                          </Alert>
                        ) : (
                          ''
                        )}

                        {log.request_method === 'GET' ? (
                          <Alert
                            severity="success"
                            sx={{ mt: 1, width: '100%', bgcolor: '#00008B', color: 'white' }}
                          >
                            <AlertTitle>{formatTimeAgo(log.request_time)}</AlertTitle>
                            Org scan started!
                          </Alert>
                        ) : (
                          ''
                        )}
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, padding: '10px' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            style={{ marginTop: '16px' }}
          />
        </Box>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnRead: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    avatar: PropTypes.any,
  }),
};

function NotificationItem({ notification }) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification.createdAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.description}
      </Typography>
    </Typography>
  );

  if (notification.type === 'order_placed') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_package.svg" />,
      title,
    };
  }
  if (notification.type === 'order_shipped') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_shipping.svg" />,
      title,
    };
  }
  if (notification.type === 'mail') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_mail.svg" />,
      title,
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_chat.svg" />,
      title,
    };
  }
  return {
    avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
  };
}
