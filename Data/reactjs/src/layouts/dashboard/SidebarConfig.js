// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Trang chủ',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill')
  },
  {
    title: 'Nhiệt Độ, Độ Ẩm',
    path: '/dashboard/temp-humid',
    icon: getIcon('carbon:humidity-alt')
  },
  {
    title: 'Thiết bị 1',
    path: '/dashboard/relay1',
    icon: getIcon('akar-icons:sun-fill')
  },
  {
    title: 'Thiết bị 2',
    path: '/dashboard/relay2',
    icon: getIcon('bi:fan')
  }
];

export default sidebarConfig;
