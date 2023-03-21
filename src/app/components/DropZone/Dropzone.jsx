import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Typography, Button } from '@mui/material';

import { HighlightOff } from '@mui/icons-material';
export default function Dropzone({
  children,
  setFieldValue,
  uploadedFiles = [],
  error,
  helperText,
  type,
}) {
  const [myFiles, setMyFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setMyFiles([...acceptedFiles]);
    },
    [myFiles]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    accept:
      type === true
        ? {
            'application/csv': ['.Custom', '.csv'],
          }
        : '',
    onDrop,
    noClick: true,
    noKeyboard: true,
    multiple: false,
  });

  const removeFile = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    const newFiles = [...myFiles];
    newFiles.splice(index, 1);
    setMyFiles(newFiles);
    setFieldValue(myFiles);
  };
  const filesList = myFiles.map((file, i) => (
    <li>
      {file.path} - {file.size} bytes
      <Button color="error" className="!ml-10" onClick={(e) => removeFile(e, i)}>
        <HighlightOff />
      </Button>
    </li>
  ));
  const uploadedFilesComponent = uploadedFiles?.map((file, i) => (
    <li>
      {' '}
      <a href={file?.nft_documents} target="_blank" download>
        {file?.nft_documents?.split(/(\\|\/)/g).pop()}
      </a>
    </li>
  ));
  useEffect(() => {
    setFieldValue(myFiles);
  }, [myFiles]);
  return (
    <div style={{ cursor: 'pointer' }}>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />

        <button
          type="button"
          onClick={open}
          style={{ cursor: 'pointer', border: 'unset', background: 'unset' }}
        >
          {children}
        </button>
      </div>
      {myFiles?.length > 0 ? (
        <aside>
          <h4>Files</h4>
          <ul>{filesList}</ul>
        </aside>
      ) : (
        <aside>
          <h4>Files</h4>
          <ul>{uploadedFilesComponent}</ul>
        </aside>
      )}
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
    </div>
  );
}
