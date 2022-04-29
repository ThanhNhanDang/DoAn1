import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
//
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function DashboardNavbar({ onOpenSidebar }) {
  const tempMax = 32;
  const humidMax = 70;
  const [warning, setWarning] = useState('');
  const message = useSelector((state) => state.message);

  useEffect(() => {
    const handleWarning = (topic) => {
      let mess;
      if (topic === 'doan1/warning') {
        if (message.t > tempMax && message.h > humidMax)
          mess = `CẢNH BÁO !!! NHIỆT ĐỘ VÀ ĐỘ ẨM CAO KHÔNG THỂ HẠ :<, ${message.t} độ C, ${message.h} %`;
        else if (message.t > tempMax)
          mess = `CẢNH BÁO !!! NHIỆT ĐỘ CAO KHÔNG THỂ HẠ :<, ${message.t} độ C`;
      } else if (message.t > tempMax && message.h > humidMax)
        mess = `CẢNH BÁO !!! ĐỘ ẨM CAO :(, ${message.t} độ C, ${message.h}  %`;
      else if (message.t > tempMax) mess = `CẢNH BÁO !!! NHIỆT ĐỘ CAO :(, ${message.t} độ C`;
      else if (message.h > humidMax) mess = `CẢNH BÁO !!! ĐỘ ẨM CAO :(, ${message.h} %`;

      setWarning(mess);
    };
    if (message.t > tempMax || message.h > humidMax) {
      handleWarning(message.tp);
    } else setWarning('');
  }, [message]);

  return (
    <RootStyle>
      <ToolbarStyle>
        <IconButton
          onClick={onOpenSidebar}
          sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
        <Typography color="red">{warning}</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <LanguagePopover />
          <NotificationsPopover />
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
