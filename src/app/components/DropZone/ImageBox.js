import React from 'react';
import { Box, CardMedia } from '@mui/material';

export default function ImageBox({
  component,
  href,
  className,
  alt,
  src,
  style,
  imageClasses,
  styleImage,
  extension,
}) {
  return (
    <Box href={href} className={`    ${className} image-wrapper`} style={style}>
      {src && (
        <CardMedia
          component="img"
          src={src}
          alt={alt}
          className={`${imageClasses} w-full`}
          style={styleImage}
        />
      )}
      {component && React.createElement(component, {})}
    </Box>
  );
}
