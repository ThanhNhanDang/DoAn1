import { Container, Grid } from '@mui/material';
import React from 'react';
import { Button2, ChartRelay2, Humid, TableRelay2, Temp } from '../sections/@dashboard/app';
import Page from '../components/Page';

function Relay2({ handleOnOff2 }) {
  return (
    <Page title="Thiết bị 2 | Đồ án 1">
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={12}>
            <Button2 handleOnOff2={handleOnOff2} />
          </Grid>
          <Grid item xs={12} sm={6} md={12}>
            <ChartRelay2 />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Temp />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Humid />
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
            <TableRelay2 />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default Relay2;
