import { Box, Button, TextField } from '@mui/material';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import chatAvatar from '../../../assets/chat-avatar.png';
import StarIcon from '@mui/icons-material/Star';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from '../../../axios';
import toast, { Toaster } from 'react-hot-toast';
import { GET_USER_CHAT_LIST, POST_ADMIN_CUSTOMER_CHAT } from 'app/api';
import moment from 'moment';

function CustomerChat({ bookindDetails }) {
  const messagesEndRef = useRef(null);
  const [chatMessage, setChatMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatList, setChatList] = useState(null);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [chatList]);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (chatMessage !== '') {
      if (bookindDetails?.dashboard) {
        const dupObj = {
          message: chatMessage,
          is_read: true,
          user: bookindDetails?.bod?.user,
          collection: chatList?.id,
          parent_id: null,
        };
        toast.promise(
          axios.post(`${POST_ADMIN_CUSTOMER_CHAT}?booking_id=${bookindDetails?.id}`, dupObj, {
            headers: { 'Content-Type': 'application/json' },
          }),
          {
            loading: () => {
              return `Sending Message!`;
            },
            success: (res) => {
              setLoading(false);
              setChatMessage('');
              getAllChats();
              return res?.data?.message;
            },
            error: (err) => {
              setLoading(false);
              return err?.message;
            },
          }
        );
      } else {
        toast.error('User must be registered to continue with chat!');
      }
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllChats();
  }, [bookindDetails]);
  const getAllChats = async () => {
    await axios
      .get(`${GET_USER_CHAT_LIST}?booking=${bookindDetails?.id}`)
      .then((res) => {
        setChatList(res?.data?.data || null);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box
      sx={{
        boxShadow: 'rgb(30 41 59 / 4%) 0 2px 4px 0',
        border: ' 1px solid rgba(98,105,118,.16)',
        background: '#f2f5f8',
        borderRadius: '4px',
      }}
    >
      <Box
        sx={{
          padding: '10px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            '& img': {
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: '2px solid green',
            },
            '& h3': {
              margin: 'unset',
            },
            '& p': {
              margin: 'unset',
            },
          }}
        >
          <img src={chatAvatar} alt="avatar" />
          <Box sx={{ paddingLeft: '0.5rem' }}>
            <h3>Booking Chat</h3>
            <p>Active</p>
          </Box>
        </Box>
        <StarIcon sx={{ fill: '#d8dadf' }} />
      </Box>
      <Box
        ref={messagesEndRef}
        sx={{
          height: '60vh',
          padding: '20px 20px 0px 0px',
          overflowY: 'auto',
          overflowX: 'hidden',
          '& ul': {
            marginBottom: 'unset',
          },
        }}
      >
        <ul>
          {!!chatList?.chat?.length &&
            chatList?.chat?.map((item, index) => (
              <li key={index} style={{ paddingBottom: '1.5rem' }}>
                {item?.user_role !== 'Customer' ? (
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '& p': {
                          margin: 'unset',
                          paddingLeft: '0.3rem',
                          color: '#a8aab1',
                          fontSize: 'small',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          background: '#86bb71',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                        }}
                      ></Box>
                      <p>{moment.utc(item?.created_at).format('MMM DD, YYYY h:mm a')}</p>
                    </Box>
                    <Box
                      sx={{
                        marginTop: '0.5rem',
                        background: '#86bb71',
                        fontSize: 'medium',
                        padding: '10px',
                        borderRadius: '7px',
                        color: 'white',
                        width: 'fit-content',
                        maxWidth: '100%',
                        position: 'relative',
                        borderTopLeftRadius: '0px !important',
                        wordBreak: 'break-all',
                        whiteSpace: 'break-spaces',
                      }}
                    >
                      <Box
                        sx={{
                          background: 'white',
                          position: 'absolute',
                          top: '-10px',
                          left: '0px',
                          width: '0',
                          height: '0',
                          borderBottom: '10px solid #86bb71',
                          borderRight: '18px solid #f2f5f8',
                        }}
                      ></Box>
                      {item?.message}
                    </Box>
                    <Box sx={{ fontSize: 'small', color: '#a8aab1' }}>
                      {item?.user?.user_profile?.first_name} {item?.user?.user_profile?.last_name}
                    </Box>
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'end',
                        '& p': {
                          margin: 'unset',
                          paddingRight: '0.3rem',
                          color: '#a8aab1',
                          fontSize: 'small',
                        },
                      }}
                    >
                      <p>{moment.utc(item?.created_at).format('MMM DD, YYYY h:mm a')}</p>
                      <Box
                        sx={{
                          background: '#94c2ed',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                        }}
                      ></Box>
                    </Box>
                    <Box
                      sx={{
                        marginTop: '0.5rem',
                        background: '#94c2ed',
                        fontSize: 'medium',
                        padding: '10px',
                        borderRadius: '7px',
                        color: 'white',
                        width: 'fit-content',
                        maxWidth: '100%',
                        position: 'relative',
                        borderTopRightRadius: '0px !important',
                        marginLeft: 'auto',
                        wordBreak: 'break-all',
                        whiteSpace: 'break-spaces',
                      }}
                    >
                      <Box
                        sx={{
                          background: 'white',
                          position: 'absolute',
                          top: '-10px',
                          right: '0px',
                          width: '0',
                          height: '0',
                          borderBottom: '10px solid #94c2ed',
                          borderLeft: '18px solid #f2f5f8',
                        }}
                      ></Box>
                      {item?.message}
                    </Box>
                    <Box sx={{ fontSize: 'small', color: '#a8aab1', textAlign: 'right' }}>
                      {item?.user?.user_profile?.first_name} {item?.user?.user_profile?.last_name}
                    </Box>
                  </>
                )}
              </li>
            ))}
        </ul>
      </Box>
      <Box sx={{ padding: '10px' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            sx={{ background: 'white' }}
            error={loading && chatMessage === ''}
            multiline
            rows={3}
            id="outlined-error"
            fullWidth
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
          />
          <Box
            sx={{
              paddingTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'end',
            }}
          >
            <LoadingButton
              size="small"
              type="submit"
              endIcon={<SendIcon />}
              loading={loading}
              loadingPosition="end"
              variant="contained"
            >
              SEND
            </LoadingButton>
          </Box>
        </form>
      </Box>
      <Toaster position="top-right" />
    </Box>
  );
}

export default CustomerChat;
