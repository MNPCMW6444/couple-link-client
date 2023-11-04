import {useContext, useState} from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Box,
    Avatar,
    MenuItem,
    Menu,
    Divider,
    useMediaQuery,
    Select,
    Button,
    Typography,
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
    const {user, signout} = useContext(UserContext);
    const {contacts, contactsIds} = useContext(ContactsContext);
    const {pairId, setPairId, sessions, selectedSession, setSelectedSession, createSession} = useContext(ChatContext);
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const handleMenu = (event: any) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

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
                    <ListItem
                        onClick={handleMenu}
                        sx={{...routingItemStyle}}
                    >
                        <ListItemIcon>
                            <Avatar sx={{width: 24, height: 24}}>{user?.number}</Avatar>
                        </ListItemIcon>
                        {open && <ListItemText primary="Menu"/>}
                        {!open && <ArrowDropDownCircleOutlined/>}
                    </ListItem>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                        <MenuItem onClick={() => signout()}>
                            <Logout/> Logout
                        </MenuItem>
                    </Menu>
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

                    {pairId && (
                        <>
                            <ListItem
                                onClick={() => navigate("/chat")}
                                sx={{...routingItemStyle}}
                            >
                                <ListItemIcon><ChatOutlined/></ListItemIcon>
                                {open && <ListItemText primary="Chats"/>}
                            </ListItem>

                            <Typography variant="h6" display="block" gutterBottom sx={{marginLeft: 2}}>
                                {open ? "Switch Session:" : <ArrowDropDownCircleOutlined/>}
                            </Typography>

                            <ListItem>
                                <Select
                                    value={selectedSession || ''}
                                    onChange={(e) => setSelectedSession(e.target.value)}
                                    sx={{width: '100%', margin: '1em 0'}}
                                >
                                    {sessions.map((session, idx) => (
                                        <MenuItem key={idx} value={session}>{session}</MenuItem>
                                    ))}
                                </Select>
                            </ListItem>
                            <ListItem>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => pairId && createSession(pairId)}
                                >
                                    Create Session
                                </Button>
                            </ListItem>
                        </>
                    )}
                </List>
            </Drawer>
        </Box>
    );
};

export default WhiteSideBar;
