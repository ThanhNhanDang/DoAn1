import { Container, Grid } from '@mui/material';
import React from 'react';
import { Button1, ChartRelay1, Humid, TableRelay1, Temp } from '../sections/@dashboard/app';
import Page from '../components/Page';

function Relay1({ handleOnOff1 }) {
  return (
    <Page title="Thiết bị 1 | Đồ án 1">
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={12}>
            <Button1 handleOnOff1={handleOnOff1} />
          </Grid>
          <Grid item xs={12} sm={6} md={12}>
            <ChartRelay1 />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Temp />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Humid />
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
            <TableRelay1 />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default Relay1;
