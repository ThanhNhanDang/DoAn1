import { Box, Container, Typography, Grid } from '@mui/material';
import React from 'react';
import Page from '../components/Page';
import { Humid, Temp, ChartDht, TableDHT } from '../sections/@dashboard/app';

function TempHumid() {
  return (
    <Page title="Nhiệt độ, độ ẩm | Đồ án 1">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography style={{ textAlign: 'center' }} variant="h3">
            Nhiệt Độ, Độ Ẩm
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <Temp />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Humid />
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
            <ChartDht />
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
            <TableDHT />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default TempHumid;
