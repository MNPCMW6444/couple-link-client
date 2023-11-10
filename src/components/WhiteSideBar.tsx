import {useContext, useEffect, useState} from "react";
import {
    Drawer,
    List,
    ListItem,
    IconButton,
    Box,
    MenuItem,
    Divider,
    Select,
    ListItemButton, Button, ListItemIcon, ListItemText,
} from "@mui/material";
import {
    Menu as MenuIcon,
    MenuOpen,
    Close,
    ContactsOutlined,
    ChatOutlined,
    Logout, NotificationAdd, DeveloperMode,
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import UserContext from "../context/UserContext.tsx";
import ContactsContext from "../context/ContactsContext.tsx";
import ChatContext from "../context/ChatContext.tsx";
import useMobile from "../hooks/responsiveness/useMobile.ts";
import {gql, useMutation} from "@apollo/client";

const DRAWER_WIDTH_OPEN = "255px";
const DRAWER_WIDTH_CLOSED = "56px";


const SUBSCRIBE_TO_PUSH = gql`
  mutation SubscribeToPush($subscription: JSON!) {
    subscribeToPush(subscription: $subscription)
  }
`;


const WhiteSideBar = () => {
    const {isMobile} = useMobile();
    const [open, setOpen] = useState(!isMobile);
    const {signout} = useContext(UserContext);
    const {contacts, contactsIds} = useContext(ContactsContext);
    const {pairId, setPairId, sessions, selectedSession, setSelectedSession} = useContext(ChatContext);
    const navigate = useNavigate();


    const [subscribeToPush] = useMutation(SUBSCRIBE_TO_PUSH);


    const handleSubscribeClick = () => {
        const urlBase64ToUint8Array = (base64String: string) => {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding)
                .replace(/-/g, '+')
                .replace(/_/g, '/');
            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);
            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }

        navigator.serviceWorker.ready.then((registration) => {
            registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('BOX9mgkzgqKdn0j6vi-86nqWXoo24Ir4NAPwLe3M-lHgZpBLT153asOtuX1ocALmL3aRzBWgoRhjDAC80-llb6g')
            })
                .then((subscription) => {
                    // Convert the subscription object to the correct format
                    const graphqlSubscription = {
                        endpoint: subscription.endpoint,
                        keys: {
                            p256dh: subscription?.toJSON()?.keys?.p256dh,
                            auth: subscription?.toJSON()?.keys?.auth,
                        },
                    };

                    // Send the properly formatted subscription object to your server
                    subscribeToPush({variables: {subscription: graphqlSubscription}});
                })
                .catch((error) => {
                    console.error('Error during getSubscription()', error);
                });
        });
    };


    useEffect(() => {
        setOpen(!isMobile)
    }, [isMobile]);


    const routingItemStyle = {
        cursor: 'pointer',
        backgroundColor: '#009688',
        margin: '5px 0',
        borderRadius: 2,
        '&:hover': {
            backgroundColor: '#bdbdbd',
        },
    };

    const headersStyle = {
        backgroundColor: '#e0e0e0',
        margin: '5px 0',
        borderRadius: 2,
    };


    return (
        <Box>
            {isMobile && !open && (
                <IconButton
                    onClick={() => setOpen(!open)}
                    sx={{position: "fixed", zIndex: 1201}}
                >
                    {open ? <MenuOpen/> : <MenuIcon/>}
                </IconButton>
            )}
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={isMobile ? open : true}
                onClose={() => setOpen(false)}
                sx={{
                    width: open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
                        transition: "width 0.3s",
                    },
                }}
            >
                <List>
                    {isMobile && (
                        <ListItem
                            onClick={() => setOpen(!open)}
                            sx={{display: "flex", justifyContent: "center"}}
                        >
                            <ListItemIcon>{open ?
                                <Close sx={{backgroundColor: "#BBBBBB", borderRadius: 20}}/> :
                                <MenuIcon/>}</ListItemIcon>
                        </ListItem>
                    )}
                    <ListItem
                        onClick={() => {
                            navigate("/contacts")
                            if (isMobile) setOpen(false);
                        }}
                        sx={{...routingItemStyle}}
                    >
                        <ListItemIcon><ContactsOutlined/></ListItemIcon>
                        {open && <ListItemText primary="Manage Contacts"/>}
                    </ListItem>
                    <ListItem sx={headersStyle}>
                        <ListItemIcon><ContactsOutlined/></ListItemIcon>
                        {open && <ListItemText primary="Switch Contact:"/>}
                    </ListItem>
                    <ListItem>
                        <Select
                            value={contacts[contactsIds.findIndex(id => id === pairId)] || ''}
                            onChange={(e) => setPairId(contactsIds[contacts.findIndex(number => number === e.target.value)])}
                            sx={{width: '100%', margin: '1em 0'}}
                        >
                            {contacts?.map((contact, idx) => (
                                <MenuItem key={idx} value={contact}>{contact}</MenuItem>
                            ))}
                        </Select>
                    </ListItem>
                    <br/> <Divider/>
                    <br/> <ListItemButton
                    onClick={() => {
                        navigate("/sessions")
                        if (isMobile) setOpen(false);
                    }}
                    sx={{...routingItemStyle}}
                    disabled={!pairId}
                >
                    <ListItemIcon><ChatOutlined/></ListItemIcon>
                    {open && <ListItemText primary="Manage Chats"/>}
                </ListItemButton>
                    <ListItem sx={headersStyle} disabled={!pairId}>
                        <ListItemIcon><ContactsOutlined/></ListItemIcon>
                        {open && <ListItemText primary="Switch Chat:"/>}
                    </ListItem>
                    <br/>
                    {sessions.length > 4 ?
                        <Select
                            value={selectedSession}
                            onChange={(e) => setSelectedSession(e.target.value)}
                            sx={{width: '100%', margin: '1em 0'}}
                        >
                            {sessions?.map(({_id, name}) => (
                                <MenuItem key={_id} value={_id}>{name}</MenuItem>
                            ))}
                        </Select>
                        : sessions.map(({_id, name}) => (
                            <ListItem> <Button variant={_id === selectedSession ? "contained" : "outlined"} key={_id}
                                               sx={{width: "100%"}} onClick={() => {
                                setSelectedSession(_id)
                                navigate("/chat")
                                if (isMobile) setOpen(false);
                            }}>{name}</Button> </ListItem>
                        ))}
                    <br/> <Divider/>
                    <br/> <ListItem
                    onClick={() => signout()}
                    sx={{...routingItemStyle}}
                >

                    <ListItemIcon><Logout/></ListItemIcon>
                    {open && <ListItemText primary="Logout"/>}

                </ListItem>

                    <ListItem
                        onClick={handleSubscribeClick}
                        sx={{...routingItemStyle}}
                    >

                        <ListItemIcon><NotificationAdd/></ListItemIcon>
                        {open && <ListItemText primary="Enable Notifications"/>}

                    </ListItem>


                    <ListItem
                        onClick={() => navigate("/rnd")}
                        sx={{...routingItemStyle}}
                    >

                        <ListItemIcon><DeveloperMode/></ListItemIcon>
                        {open && <ListItemText primary="Prompt R&D"/>}

                    </ListItem>


                </List>
            </Drawer>
        </Box>
    );
};

export default WhiteSideBar;
