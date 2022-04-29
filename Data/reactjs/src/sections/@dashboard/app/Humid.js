import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';
import { RadialGauge } from 'react-canvas-gauges';
import { useSelector } from 'react-redux';

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(11, 0),
  color: theme.palette.info.darker
}));
function Humid() {
  const messageMQTT = useSelector((state) => state.message);
  return (
    <RootStyle>
      <RadialGauge
        width={300}
        height={300}
        units="(%)"
        title="Độ Ẩm"
        value={messageMQTT.h}
        minValue={0}
        maxValue={100}
        colorValueBoxRect="#049faa"
        colorValueBoxRectEnd="#049faa"
        colorValueBoxBackground="#f1fbfc"
        valueInt={2}
        majorTicks={['0', '20', '40', '60', '80', '100']}
        minorTicks={4}
        strokeTicks="true"
        highlights={[
          {
            from: 60,
            to: 100,
            color: '#03C0C1'
          }
        ]}
        colorPlate="#fff"
        borderShadowWidth={0}
        borders={false}
        needleType="line"
        colorNeedle="#007F80"
        colorNeedleEnd="#007F80"
        needleWidth={2}
        needleCircleSize={3}
        colorNeedleCircleOuter="#007F80"
        needleCircleOuter="true"
        needleCircleInner={false}
        animationDuration={1500}
        animationRule="linear"
      >
        {' '}
      </RadialGauge>
    </RootStyle>
  );
}

export default Humid;
