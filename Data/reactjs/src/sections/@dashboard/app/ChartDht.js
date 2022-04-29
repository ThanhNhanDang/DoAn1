import { Box, Card, CardHeader } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';

function ChartDht1() {
  const data = useSelector((state) => state.dhtChart);
  let arrayTemp = [];
  let arrayHumid = [];
  const arrayDate = [];
  data.forEach((item) => {
    arrayTemp.push(item.temp);
    arrayHumid.push(item.humid);
    arrayDate.push(new Date(Number(item.timestamp)).toISOString());
  });
  arrayTemp = Array.from(arrayTemp);
  arrayHumid = Array.from(arrayHumid);
  const [dataDhtChart, setDataDhtChart] = useState({
    series: [
      {
        name: 'Nhiệt Độ',
        data: arrayTemp
      },
      {
        name: 'Độ Ẩm',
        data: arrayHumid
      }
    ],
    options: {
      chart: {
        height: 450,
        type: 'area'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'datetime',
        categories: arrayDate,
        labels: {
          datetimeUTC: false
        }
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm:ss'
        }
      },
      annotations: {
        yaxis: [
          {
            y: 32,
            borderColor: 'red',
            label: {
              show: true,
              text: 'Ngưỡng nhiệt độ báo động',
              style: {
                color: '#fff',
                background: '#364cf4'
              }
            }
          },
          {
            y: 70,
            borderColor: 'yellow',
            label: {
              show: true,
              text: 'Ngưỡng độ ẩm báo động',
              style: {
                color: '#fff',
                background: '#364cf4'
              }
            }
          }
        ]
      }
    }
  });

  return (
    <Card>
      <CardHeader title="Biểu Đồ Nhiệt Độ Và Độ Ẩm" subheader="Thời gian thực" />
      <Box sx={{ p: 2, pb: 1 }} dir="ltr">
        <ReactApexChart
          options={dataDhtChart.options}
          series={dataDhtChart.series}
          type="area"
          height={450}
        />
      </Box>
    </Card>
  );
}

export default ChartDht1;
