import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ImageBox from './ImageBox';
import UploadFrame from '../../../assets/UploadFileBoxCircle.png';

export const ImageUpload = ({
  name,
  inputProps,
  onChange,
  src,
  selectedImageProps,
  buttonProps,
  error,
  helperText,
  Isvideo = false,
}) => {
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [extension, setExtension] = useState('');

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      onChange(name, null);
      return;
    }

    const extension = e.target.files[0].name.split('.').pop();
    /* 		const isExtenstionMatch=fasle;
		if (inputProps?.accept) {
			const accept = inputProps?.accept || ""
			if(accept.includes("image")){
				 imagesTypeStatic.includes(extension);
			}

		} */
    setExtension(extension);

    onChange(name, e.target.files[0]);

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };
  let child = (
    <ImageBox
      extension={typeof src === 'string' && src?.split('.')?.pop()}
      src={src ? src : UploadFrame}
      {...selectedImageProps}
    />
  );
  if (selectedFile) {
    child = <ImageBox extension={Isvideo && extension} src={preview} {...selectedImageProps} />;
  }
  // console.log("error", error, "helperText", helperText);
  return (
    <>
      <Button htmlFor={name} component="label" {...buttonProps}>
        <input type="file" id={name} onChange={onSelectFile} hidden name={name} {...inputProps} />
        {child}
      </Button>
      {error && (
        <Typography
          className="block text-red-500 pl-1 Mui-error"
          sx={{
            fontWeight: '400',
            fontSize: '0.75rem',
            lineHeight: '1.66',
            letterSpacing: '0.03333em',
            textAlign: 'left',
            marginTop: '4px',
            marginBottom: '0',
            marginLeft: '14px',
            color: '#FF3D57',
          }}
        >
          {helperText}
        </Typography>
      )}
    </>
  );
};
