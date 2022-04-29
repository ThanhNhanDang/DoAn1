import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';

import { LinearGauge } from 'react-canvas-gauges';
import { useSelector } from 'react-redux';

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.info.darker
}));

function Temp() {
  const messageMQTT = useSelector((state) => state.message);

  return (
    <RootStyle>
      <LinearGauge
        width={120}
        height={400}
        units="°C"
        title="Nhiệt Độ"
        minValue={0}
        startAngle={90}
        ticksAngle={180}
        maxValue={40}
        value={messageMQTT.t}
        colorValueBoxRect="#049faa"
        colorValueBoxRectEnd="#049faa"
        colorValueBoxBackground="#f1fbfc"
        valueDec={2}
        valueInt={2}
        majorTicks={['0', '5', '10', '15', '20', '25', '30', '35', '40']}
        minorTicks={4}
        strokeTicks="true"
        highlights={[
          {
            from: 32,
            to: 40,
            color: 'rgba(200 50 50 .75)'
          }
        ]}
        colorPlate="#fff"
        colorBarProgress="#CC2936"
        colorBarProgressEnd="#049faa"
        borderShadowWidth={0}
        borders={false}
        needleType="arrow"
        needleWidth={2}
        needleCircleSize={7}
        needleCircleOuter="true"
        needleCircleInner={false}
        animationDuration={1500}
        animationRule="linear"
        barWidth={10}
      >
        {' '}
      </LinearGauge>
    </RootStyle>
  );
}

export default Temp;
