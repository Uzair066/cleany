import React, { useState, useRef, useEffect } from 'react';
import { Grid, Box, TextField, IconButton, Typography, styled } from '@mui/material';
import { SendOutlined } from '@mui/icons-material';
import { ADMIN_CHAT, GET_ADMIN_CHAT } from 'app/api';
import axios from '../../../../../axios';
import ChatAvatar from '../../../../../assets/chat-avatar.png';
import moment from 'moment';

const ChatHeading = styled('h3')(({ theme }) => ({
  marginTop: 'unset',
  paddingBottom: '10px',
  typography: 'body1',
  color: 'black',
  borderBottom: '1px solid',
  borderBottomColor: theme.palette.text.secondary,
  textAlign: 'center',
  fontWeight: '900 !important',
  fontSize: '24px !important',
}));

const Chat = () => {
  const bottomRef = useRef(null);
  const [gettingChats, setGettingChats] = React.useState([]);
  const [selectedChat, setSelectedChatMessages] = React.useState([]);
  const [noChatSelected, setNoChatSelected] = React.useState(true);
  const [selectedChatID, setSelectedChatID] = useState(null);
  const [message, setMessage] = React.useState('');
  const [searchText, setSearchText] = useState('');

  const getAdminChats = async () => {
    await axios
      .get(`${GET_ADMIN_CHAT}`)
      .then((res) => {
        const dataToMap = res?.data?.data;
        setGettingChats(dataToMap);
        return dataToMap;
      })
      .catch((err) => console.log(err));
  };
  React.useEffect(() => {
    getAdminChats();
  }, []);

  const customerID = selectedChat?.filter((customer) => {
    return customer?.user?.user_profile?.role === 'Customer' && customer?.user;
  });
  const PostAdminChat = async () => {
    const values = {
      message: message,
      is_read: false,
      user: customerID[0].id,
      collection: selectedChat[0].collection,
      parent_id: null,
    };
    const data = await axios.post(`${ADMIN_CHAT}`, values, {
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await data.data;
    if (res.status_code === 200) {
      axios.get(`${GET_ADMIN_CHAT}`).then((res) => {
        setGettingChats(res.data.data);
        let findedChats = res?.data?.data.find((item) => item?.id == selectedChatID);
        setSelectedChatMessages(findedChats?.chats);
      });
    }
    setMessage('');
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    PostAdminChat();
  };
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat]);
  return (
    <>
      <ChatHeading>Chatting Room</ChatHeading>
      <Grid container>
        <Grid
          item
          md={3}
          sx={{
            borderRight: '1px   lightgray',
            height: '500px',
            backgroundImage:
              'linear-gradient(to bottom, rgba(34,42,69, 0.96), rgba(34,42,69, 0.96)),url( ) ',
            color: '#fff',
            overflow: 'scroll',
          }}
        >
          <Grid container>
            <TextField
              id="search"
              label="search user"
              variant="filled"
              fullWidth
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ bgcolor: '#fbfbfb', mt: 3, mx: 2 }}
            />
            {gettingChats
              ?.filter(
                (s) =>
                  s?.user?.user_profile?.first_name
                    ?.toLocaleLowerCase()
                    ?.includes(searchText?.toLocaleLowerCase()) ||
                  s?.user?.user_profile?.last_name
                    ?.toLocaleLowerCase()
                    ?.includes(searchText?.toLocaleLowerCase())
              )
              .map((chat) => {
                return (
                  <Grid
                    item
                    md={12}
                    sx={{
                      p: 1,
                      border: '1px   lightgray',
                      display: 'flex',
                      alignItems: 'center',
                      m: 2,
                      height: '50px',
                      '&:hover': { background: 'darkblue', cursor: 'pointer' },
                    }}
                    onClick={() => {
                      setSelectedChatID(chat.id);
                      setSelectedChatMessages(chat.chats);
                      setNoChatSelected(false);
                    }}
                  >
                    <Box
                      component={'img'}
                      sx={{ width: '40px', height: '40px', borderRadius: '50%', mr: 1 }}
                      src={ChatAvatar}
                    />
                    {chat?.user?.user_profile?.first_name} {chat?.user?.user_profile?.last_name}{' '}
                  </Grid>
                );
              })}
          </Grid>
        </Grid>
        <Grid item md={9} sx={{ p: 0 }}>
          <Grid container>
            <Grid
              item
              ref={bottomRef}
              md={12}
              sx={{
                height: '600px',
                overflowY: 'scroll',
                height: '500px',
                display: 'flex',
                flexDirection: ' column',
                bgcolor: '#fbfbfb',
              }}
            >
              {noChatSelected ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Typography component="h3" variant="h4" sx={{ color: 'black' }}>
                    {' '}
                    Select a chat to start Conversation{' '}
                  </Typography>
                </Box>
              ) : (
                <>
                  {selectedChat.map((chat) => {
                    return (
                      <Box>
                        {chat?.user?.user_profile?.role === 'Admin' ? (
                          <Box>
                            <Box
                              component="h4"
                              variant="h4"
                              sx={{
                                padding: 2,
                                margin: 2,
                                textAlign: 'left',
                                display: 'flex',
                                justifyContent: 'right',
                                alignItems: 'end',
                                flexDirection: 'column',
                              }}
                              key={chat.id}
                            >
                              <Box sx={{ fontSize: 'small', paddingBottom: '5px' }}>
                                {moment.utc(chat.created_at).format('lll')}
                              </Box>
                              <Box
                                sx={{
                                  bgcolor: 'darkblue',
                                  color: 'white',
                                  p: 2,
                                  borderRadius: '10px',
                                }}
                              >
                                {chat.message}
                              </Box>
                            </Box>
                          </Box>
                        ) : (
                          <Box>
                            <Box
                              component="h4"
                              variant="h4"
                              sx={{
                                padding: 2,
                                margin: 2,
                                textAlign: 'right',
                                display: 'flex',
                                justifyContent: 'left',
                                alignItems: 'start',
                                flexDirection: 'column',
                              }}
                              key={chat.id}
                            >
                              <Box sx={{ fontSize: 'small', paddingBottom: '5px' }}>
                                {moment.utc(chat.created_at).format('lll')}
                              </Box>
                              <Box
                                sx={{
                                  bgcolor: 'white',
                                  color: 'black',
                                  p: 2,
                                  borderRadius: '10px',
                                  border: '1px solid blue',
                                }}
                              >
                                {chat.message}
                              </Box>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                  <div ref={bottomRef} />
                </>
              )}
            </Grid>
            {!noChatSelected && (
              <Grid md={12} item>
                <Box component="form" onSubmit={handleSubmit} width="100% ">
                  <Grid container sx={{ mt: 1 }}>
                    <Grid item md={11.5} sx={{ bottom: 0 }}>
                      <Box>
                        <TextField
                          fullWidth
                          label="Type Here"
                          id="fullWidth"
                          value={message}
                          required
                          onChange={(e) => {
                            setMessage(e.target.value);
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item md={0.5} sx={{ bottom: 0 }}>
                      <Box>
                        <IconButton type="submit">
                          <SendOutlined />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Chat;
