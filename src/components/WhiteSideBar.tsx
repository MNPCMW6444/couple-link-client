import {useContext, useState} from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Box,
    MenuItem,
    Divider,
    useMediaQuery,
    Select,
    Typography, ListItemButton,
} from "@mui/material";
import {
    Menu as MenuIcon,
    MenuOpen,
    Close,
    ContactsOutlined,
    ChatOutlined,
    Logout,
    ArrowDropDownCircleOutlined,
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import UserContext from "../context/UserContext.tsx";
import ContactsContext from "../context/ContactsContext.tsx";
import ChatContext from "../context/ChatContext.tsx";

const DRAWER_WIDTH_OPEN = "255px";
const DRAWER_WIDTH_CLOSED = "56px";

const WhiteSideBar = () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [open, setOpen] = useState(!isMobile);
    const {signout} = useContext(UserContext);
    const {contacts, contactsIds} = useContext(ContactsContext);
    const {pairId, setPairId, sessions, selectedSession, setSelectedSession} = useContext(ChatContext);
    const navigate = useNavigate();


    const routingItemStyle = {
        cursor: 'pointer',
        backgroundColor: '#e0e0e0',
        margin: '5px 0',
        borderRadius: 2,
        '&:hover': {
            backgroundColor: '#bdbdbd',
        },
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
                            sx={{...routingItemStyle}}
                        >
                            <ListItemIcon>{open ? <Close/> : <MenuIcon/>}</ListItemIcon>
                        </ListItem>
                    )}

                    <Divider/>

                    <ListItem
                        onClick={() => navigate("/contacts")}
                        sx={{...routingItemStyle}}
                    >
                        <ListItemIcon><ContactsOutlined/></ListItemIcon>
                        {open && <ListItemText primary="Manage Contacts"/>}
                    </ListItem>
                    <Divider/>

                    <Typography variant="h6" display="block" gutterBottom sx={{marginLeft: 2}}>
                        {open ? "Switch Contact:" : <ArrowDropDownCircleOutlined/>}
                    </Typography>
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


                    <ListItemButton
                        onClick={() => navigate("/sessions")}
                        sx={{...routingItemStyle}}
                        disabled={!pairId}
                    >
                        <ListItemIcon><ChatOutlined/></ListItemIcon>
                        {open && <ListItemText primary="Manage Chats"/>}
                    </ListItemButton>

                    <Typography variant="h6" display="block" gutterBottom sx={{marginLeft: 2}}
                                color={!pairId ? "gray" : "black"}>
                        {open ? "Switch Chat:" : <ArrowDropDownCircleOutlined/>}
                    </Typography>

                    <ListItem>
                        <Select
                            disabled={!pairId}
                            value={selectedSession || ''}
                            onChange={(e) => setSelectedSession(e.target.value)}
                            sx={{width: '100%', margin: '1em 0'}}
                        >
                            {sessions.map(({_id, name}) => (
                                <MenuItem key={_id} value={_id}>{name}</MenuItem>
                            ))}
                        </Select>
                    </ListItem>
                    {/*  <ListItem>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => pairId && createSession(pairId)}
                            disabled={!pairId}
                        >
                            <Add/> Create Session
                        </Button>
                    </ListItem>*/}
                    <ListItem
                        onClick={() => signout()}
                        sx={{...routingItemStyle}}
                    >

                        <ListItemIcon><Logout/></ListItemIcon>
                        {open && <ListItemText primary="Logout"/>}

                    </ListItem>


                </List>
            </Drawer>
        </Box>
    );
};

export default WhiteSideBar;
