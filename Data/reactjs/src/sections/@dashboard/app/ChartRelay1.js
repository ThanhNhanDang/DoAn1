import { Box, Card, CardHeader } from '@mui/material';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';

function ChartRelay1() {
  const data1 = useSelector((state) => state.relay1);
  const dataOn = [];
  const arrayDate = [];
  const arrayDate1 = [];
  let week = 1;
  let dateTemp = '';
  let dateTemp2 = [];
  let relay2OnNumber = 0;
  data1.forEach((item) => {
    dateTemp2 = new Date(Number(item.timestamp)).toDateString().split(' ');
    arrayDate.push(`${dateTemp2[0]} ${dateTemp2[1]} ${dateTemp2[2]} ${dateTemp2[3]}`);
  });

  dateTemp = arrayDate[0];
  arrayDate1.push(dateTemp);
  arrayDate.every((item, index) => {
    if (week >= 7) return false;
    if (dateTemp !== item) {
      week += 1;
      dataOn.push(relay2OnNumber);
      arrayDate1.push(item);
      dateTemp = item;
      relay2OnNumber = 0;
    }
    if (data1[index].state === 'ON') relay2OnNumber += 1;
    return true;
  });
  dataOn.push(relay2OnNumber);
  const [dataRelay1Chart, setDdataRelay1Chart] = useState({
    series: [
      {
        name: 'Số lần bật',
        data: dataOn
      }
    ],
    options: {
      annotations: {
        points: [
          {
            x: 'Bananas',
            seriesIndex: 0,
            label: {
              borderColor: '#775DD0',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#775DD0'
              },
              text: 'Bananas are good'
            }
          }
        ]
      },
      chart: {
        height: 350,
        type: 'bar'
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: '50%'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2
      },

      grid: {
        row: {
          colors: ['#fff', '#f2f2f2']
        }
      },
      xaxis: {
        labels: {
          rotate: -45
        },
        categories: arrayDate1,
        tickPlacement: 'on'
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100]
        }
      }
    }
  });
  return (
    <Card>
      <CardHeader title="Biểu Đồ Trạng Thái Số Lần Bật Trong Một Tuần" subheader="Thiết Bị 1" />
      <Box sx={{ p: 2, pb: 1 }} dir="ltr">
        <ReactApexChart
          type="bar"
          options={dataRelay1Chart.options}
          series={dataRelay1Chart.series}
        />
      </Box>
    </Card>
  );
}

export default ChartRelay1;
