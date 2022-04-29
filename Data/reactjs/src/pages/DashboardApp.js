// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import {
  Humid,
  Temp,
  ChartDht,
  Button1,
  Button2,
  TableDHT,
  TableRelay1,
  TableRelay2,
  ChartRelay1,
  ChartRelay2
  // AppTasks,
  // AppBugReports,
  // AppItemOrders,
  // AppNewsUpdate,
  // AppOrderTimeline,
  // AppCurrentVisits,
  // AppTrafficBySite,
  // AppCurrentSubject,
  // AppConversionRates
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

function DashboardApp({ handleOnOff1, handleOnOff2 }) {
  return (
    <Page title="Dashboard | Đồ án 1">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography style={{ textAlign: 'center' }} variant="h3">
            Đồ án 1: Thành Nhân, Vĩ Tường
          </Typography>
          <Typography style={{ textAlign: 'center' }} variant="h2">
            HỆ THỐNG GIÁM SÁT VÀ CẢNH BÁO NHIỆT ĐỘ ĐỘ ẨM
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <Temp />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Humid />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Button1 handleOnOff1={handleOnOff1} />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Button2 handleOnOff2={handleOnOff2} />
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
            <ChartDht />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <ChartRelay1 />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <ChartRelay2 />
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
            <TableDHT />
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
            <TableRelay1 />
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
            <TableRelay2 />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default DashboardApp;
