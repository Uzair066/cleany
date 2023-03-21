import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { Breadcrumb, SimpleCard } from 'app/components';
import React, { useEffect, useRef, useState } from 'react';
import axios from '../../../axios';
import { styled } from '@mui/material/styles';
import { Editor } from '@tinymce/tinymce-react';
import { EMAIL_TEMPLATE, GET_EMAIL_TEMPLATES, UPDATE_EMAIL_TEMPLATE } from 'app/api';

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}));

const ChatArea = styled(Box)(({ theme }) => ({
  p: 3,
  width: '100%',
  typography: 'body1',
  height: '100%',
  background: theme.palette.background.paper,
  boxShadow:
    '0px 3px 3px -2px rgb(0 0 0 / 6%),0px 3px 4px 0px rgb(0 0 0 / 4%),0px 1px 8px 0px rgb(0 0 0 / 4%)!important',
  borderRadius: '10px',
  padding: '10px',

  borderTop: '5px solid green',
}));
function EmailTemplate() {
  const editorRef = useRef(null);
  const [templateType, setTemplateType] = React.useState('Confirmation');
  const [emailTemplate, setEmailTemplate] = useState(null);
  const get_email_template_type = async () => {
    const res = await axios.get(`${GET_EMAIL_TEMPLATES}?email_type=${templateType}`);
    setEmailTemplate(res?.data?.data[0]);
  };
  useEffect(() => {
    get_email_template_type();
  }, [templateType]);

  const handleTemplateSelect = (event) => {
    setTemplateType(event.target.value);
  };
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      post_email_template_type(editorRef.current.getContent());
    }
  };
  const post_email_template_type = async (data) => {
    if (emailTemplate !== null) {
      await axios
        .put(`${UPDATE_EMAIL_TEMPLATE}?id=${emailTemplate?.id}`, {
          subject: 'string',
          body: data,
          email_type: templateType,
        })
        .then((res) => {
          get_email_template_type();
        });
    } else {
      await axios
        .post(`${EMAIL_TEMPLATE}`, {
          subject: 'string',
          body: data,
          email_type: templateType,
        })
        .then((res) => {
          get_email_template_type();
        });
    }
  };
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Email Template' }]} />
      </Box>

      <SimpleCard>
        <Grid item md={12}>
          <Box sx={{ minWidth: 120, my: 10 }}>
            <FormControl fullWidth>
              <InputLabel id="select-template-type-label">E-mail Template</InputLabel>
              <Select
                labelId="select-template-type-label"
                id="select-template"
                value={templateType}
                label="Select Template"
                onChange={handleTemplateSelect}
              >
                <MenuItem value={'Confirmation'}>Confirmation</MenuItem>
                <MenuItem value={'Cancelled'}>Cancelled</MenuItem>
                <MenuItem value={'Modified'}>Modified</MenuItem>
                <MenuItem value={'Reminder'}>Reminder</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <ChatArea>
            <Editor
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={emailTemplate?.body || ''}
              init={{
                height: 600,
                menubar: true,
                branding: false,
                plugins: [
                  'template',
                  'advlist',
                  'autolink',
                  'lists',
                  'link',
                  'image',
                  'charmap',
                  'preview',
                  'anchor',
                  'searchreplace',
                  'visualblocks',
                  'code',
                  'fullscreen',
                  'insertdatetime',
                  'media',
                  'table',
                  'code',
                  'help',
                  'wordcount',
                ],

                toolbar1:
                  'print |template' +
                  'undo redo | formatselect | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help | template   ',

                template_preview_replace_values: {
                  preview_userfirstname: 'participant First Name',
                  preview_userlastname: 'participant Last Name',
                  preview_useraddress: 'participant Address',
                  preview_nationality: 'participant nationality ',
                  preview_gender: ' participant gender',
                },
                templates: [
                  // {
                  //   title: "Date modified example",
                  //   description:
                  //     "Adds a timestamp indicating the last time the document modified.",
                  //   content:
                  //     "<p>Last Modified: <time class="mdate">This will be replaced with the date modified.</time></p>",
                  // },
                  {
                    title: 'Participant first  name',
                    description: '',
                    content: '<span> {{userfirstname}} </span>',
                  },
                  {
                    title: 'Participant last name',
                    description: '',
                    content: '<span> {{userlastname}} </span>',
                  },
                  {
                    title: 'Participant address',
                    description: '',
                    content: '<span> {{useraddress}} </span>',
                  },
                  {
                    title: 'Participant nationality',
                    description: '',
                    content: '<span> {{nationality}} </span>',
                  },
                  {
                    title: 'Participant gender',
                    description: '',
                    content: '<span> {{nationality}} </span>',
                  },
                  {
                    title: 'Participant bill',
                    description: '',
                    content: '<span> {{bill}} </span>',
                  },
                ],
              }}
            />
            <Box display="flex" justifyContent="end" mt={5}>
              <Button variant="contained" onClick={log}>
                {emailTemplate !== null ? 'Update Template' : 'Save Template'}
              </Button>
            </Box>
          </ChatArea>
        </Grid>
      </SimpleCard>
    </Container>
  );
}

export default EmailTemplate;
