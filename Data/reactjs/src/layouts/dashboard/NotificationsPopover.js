import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { sub, formatDistanceToNow } from 'date-fns';
import axios from 'axios';

// material
import { alpha } from '@mui/material/styles';
import {
  Box,
  List,
  Badge,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton
} from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import MenuPopover from '../../components/MenuPopover';

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
  return {
    avatar: <img alt={notification.title} src="/static/icons/ic_notification_mail.svg" />,
    title
  };
}

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired
};

function NotificationItem({ notification, handleMarkAsRead }) {
  const { avatar, title } = renderContent(notification);

  return (
    <Tooltip title="CẢNH BÁO NHIỆT ĐỘ VƯỢT MỨC QUY ĐỊNH !!!!" placement="top" followCursor>
      <ListItemButton
        onClick={() => handleMarkAsRead(notification)}
        to="#"
        disableGutters
        component={RouterLink}
        sx={{
          py: 1.5,
          px: 2.5,
          mt: '1px',
          ...(notification.isUnRead && {
            bgcolor: 'action.selected'
          })
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
                color: 'text.disabled'
              }}
            >
              <Iconify icon="eva:clock-fill" sx={{ mr: 0.5, width: 16, height: 16 }} />
              {formatDistanceToNow(new Date(notification.createdAt))}
            </Typography>
          }
        />
      </ListItemButton>
    </Tooltip>
  );
}

export default function NotificationsPopover() {
  const userAuth = useSelector((state) => state.userAuth);
  const emails = useSelector((state) => state.emails);
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    await axios
      .put(`${process.env.REACT_APP_URL}/doan1/email/update-email`, { reAddress: userAuth.email })
      .then(() => {
        setNotifications(
          notifications.map((x) => {
            x.isUnRead = false;
            return x;
          })
        );
        window.open('https://mail.google.com');
      });
  };

  const handleMarkAsRead = async (obj) => {
    await axios
      .put(`${process.env.REACT_APP_URL}/doan1/email/update-email-by-id`, { _id: obj._id })
      .then(() => {
        setNotifications(
          notifications.map((x) => {
            if (x.id === obj._id) x.isUnRead = false;
            return x;
          })
        );
        window.open('https://mail.google.com');
      });
  };

  useEffect(() => {
    const getAllEmailByUser = async () => {
      const newArray = [];
      const date = new Date();
      await emails.forEach((obj) => {
        const created = new Date(Number(obj.time));
        newArray.push({
          ...obj,
          id: obj._id,
          title: 'Bạn có một email mới',
          description: `được gửi từ ${obj.seAddress}`,
          type: 'mail',
          createdAt: sub(date, {
            days: Math.abs(date.getDate() - created.getDate()),
            hours: Math.abs(date.getHours() - created.getHours()),
            minutes: Math.abs(date.getMinutes() - created.getMinutes())
          }),
          isUnRead: obj.isUnRead
        });
      });
      setNotifications(newArray);
    };
    getAllEmailByUser();
  }, [emails]);

  return (
    <>
      <IconButton
        ref={anchorRef}
        size="large"
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
          })
        }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 360 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Thông Báo</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Bạn có {totalUnRead} thông báo chưa đọc.
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider />

        <Scrollbar sx={{ height: { xs: 340, sm: 300 } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Mới
              </ListSubheader>
            }
          >
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                handleMarkAsRead={handleMarkAsRead}
              />
            ))}
          </List>
        </Scrollbar>
        <Divider />
      </MenuPopover>
    </>
  );
}
