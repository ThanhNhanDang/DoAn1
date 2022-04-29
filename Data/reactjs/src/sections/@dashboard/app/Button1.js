// material
import { useDispatch, useSelector } from 'react-redux';
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
import Switch from 'react-switch';
import { actOnOffRelay1 } from '../../../actions/index';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker
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
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------
// akar-icons:moon-fill
export default function Button1({ handleOnOff1 }) {
  const dispatch = useDispatch();
  const messageMQTT = useSelector((state) => state.message);
  return (
    <RootStyle>
      <Typography variant="h1">THIẾT BỊ 1</Typography>
      <IconWrapperStyle>
        <Iconify icon="bi:sun-fill" width={60} height={60} />
      </IconWrapperStyle>
      <Switch
        height={50}
        width={110}
        onChange={() => handleOnOff1(messageMQTT.st1 === 'ON')}
        checked={messageMQTT.st1 === 'ON'}
      />
    </RootStyle>
  );
}
