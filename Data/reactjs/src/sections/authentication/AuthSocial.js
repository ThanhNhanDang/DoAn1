// material
import GoogleLogin from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Stack, Button } from '@mui/material';
import axios from 'axios';
import { actGetUserAuth } from '../../actions/index';
// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

export default function AuthSocial() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const responseGoogle = async (responseGG) => {
    if (responseGG.profileObj.email === null || undefined) return;

    await axios
      .post(`${process.env.REACT_APP_URL}/doan1/user/find-user`, responseGG.profileObj)
      .then((response) => {
        console.log(response.data);
        if (response.data.length === 0) {
          axios
            .post(`${process.env.REACT_APP_URL}/doan1/user/add`, {
              ...responseGG.profileObj,
              time: new Date().getTime()
            })
            .then((res) => console.log(res.data));
          localStorage.setItem('user', JSON.stringify(responseGG.profileObj));

          dispatch(actGetUserAuth(JSON.stringify(responseGG.profileObj)));
          navigate('/login/mqtt-broker', { replace: true });
        } else alert('Email đã được xử dụng');
      });
  };

  return (
    <Stack direction="row" spacing={2}>
      <GoogleLogin
        clientId={`${process.env.REACT_APP_OAUTH_CLIENTID}`}
        render={(renderProps) => (
          <Button
            fullWidth
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            size="large"
            color="inherit"
            variant="outlined"
          >
            <Iconify icon="eva:google-fill" color="#DF3E30" height={24} />
          </Button>
        )}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy="single_host_origin"
      />
    </Stack>
  );
}
