import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Box, Link } from '@mui/material';

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  
  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 100,
        height: 100,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
     <img
  src={`${process.env.PUBLIC_URL  }/favicon/tapiceria.png`}
  alt="Logo"
  style={{ width: '100%', height: '100%', cursor: 'pointer', ...sx }}
/>

    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
