import { useSelector } from 'react-redux';
// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
import Switch from 'react-switch';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.info.darker
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.info.darker,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------
// ic:baseline-mode-fan-off
export default function Button2({ handleOnOff2 }) {
  const messageMQTT = useSelector((state) => state.message);
  return (
    <RootStyle>
      <Typography variant="h1">THIẾT BỊ 2</Typography>
      <IconWrapperStyle>
        <Iconify icon="bi:fan" width={60} height={60} />
      </IconWrapperStyle>
      <Switch
        height={50}
        width={110}
        onChange={() => handleOnOff2(messageMQTT.st2 === 'ON')}
        checked={messageMQTT.st2 === 'ON'}
      />
    </RootStyle>
  );
}
