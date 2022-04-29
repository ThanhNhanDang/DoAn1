// material
import { IconButton } from '@mui/material';

// ----------------------------------------------------------------------

const LANGS = {
  value: 'vn',
  label: 'Việt Nam',
  icon: '/static/icons/vietnam.svg'
};

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  return (
    <IconButton
      sx={{
        padding: 0,
        width: 44,
        height: 44
      }}
    >
      <img src={LANGS.icon} alt={LANGS.label} />
    </IconButton>
  );
}
