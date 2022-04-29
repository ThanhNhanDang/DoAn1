import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField, IconButton, InputAdornment, Button, Typography } from '@mui/material';
import { actGetUserAuth } from '../../../actions/index';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [messageError, setMessageError] = useState(true);
  const [, setUser] = useState({});
  const dispatch = useDispatch();

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Tài khoản là bắt buộc'),
    password: Yup.string().required('Mật khẩu là bắt buộc')
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      if (
        values.username === process.env.REACT_APP_MQTT_USERNAME &&
        values.password === process.env.REACT_APP_MQTT_PASSWORD
      ) {
        localStorage.setItem(
          'user',
          JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), isLoginMqtt: true })
        );
        dispatch(actGetUserAuth(JSON.parse(localStorage.getItem('user'))));
        setUser(JSON.parse(localStorage.getItem('user')));
        navigate('/dashboard/app');
      } else {
        setMessageError(false);
        navigate('/login/mqtt-broker', { replace: true });
      }
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        {!messageError && (
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <Typography variant="h4" color="red">
              Tài Khoản hoặc mật khẩu không đúng!!!
            </Typography>
          </Stack>
        )}

        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="text"
            label="Tài Khoản"
            {...getFieldProps('username')}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Mật Khẩu"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          {' '}
        </Stack>
        <Button fullWidth size="large" type="submit" variant="contained">
          Login
        </Button>
      </Form>
    </FormikProvider>
  );
}
