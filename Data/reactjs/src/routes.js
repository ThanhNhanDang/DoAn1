import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Relay1 from './pages/Relay1';
import Relay2 from './pages/Relay2';
import NotFound from './pages/Page404';
import TempHumid from './pages/TempHumid';
import LoginMQTT from './pages/LoginMQTT';
import { actGetUserAuth } from './actions';

// ----------------------------------------------------------------------

export default function Router({ handleOnOff1, handleOnOff2 }) {
  const userAuth = JSON.parse(localStorage.getItem('user'));
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actGetUserAuth(userAuth));
  }, []);
  return useRoutes([
    {
      path: '/dashboard',
      element:
        userAuth === null || userAuth === undefined || !userAuth.isLoginMqtt ? (
          <Login />
        ) : (
          <DashboardLayout />
        ),
      children: [
        {
          path: 'app',
          element:
            userAuth === null || userAuth === undefined || !userAuth.isLoginMqtt ? (
              <Login />
            ) : (
              <DashboardApp handleOnOff1={handleOnOff1} handleOnOff2={handleOnOff2} />
            )
        },
        {
          path: 'relay1',
          element:
            userAuth === null || userAuth === undefined || !userAuth.isLoginMqtt ? (
              <Login />
            ) : (
              <Relay1 handleOnOff1={handleOnOff1} />
            )
        },
        {
          path: 'relay2',
          element:
            userAuth === null || userAuth === undefined || !userAuth.isLoginMqtt ? (
              <Login />
            ) : (
              <Relay2 handleOnOff2={handleOnOff2} />
            )
        },
        {
          path: 'temp-humid',
          element:
            userAuth === null || userAuth === undefined || !userAuth.isLoginMqtt ? (
              <Login />
            ) : (
              <TempHumid />
            )
        }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        {
          path: 'login',
          element: <Login />
        },
        { path: 'login/mqtt-broker', element: <LoginMQTT /> },
        {
          path: 'register',
          element: <Register />
        },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
