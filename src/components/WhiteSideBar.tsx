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
    ListItemButton, Button, ListItemIcon, ListItemText, Menu, Avatar,
} from "@mui/material";
import {
    Menu as MenuIcon,
    MenuOpen,
    Close,
    ContactsOutlined,
    ChatOutlined,
    DeveloperMode, Settings, Info, Logout,
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import UserContext from "../context/UserContext";
import ContactsContext from "../context/ContactsContext";
import ChatContext from "../context/ChatContext";
import useMobile from "../hooks/responsiveness/useMobile";

const DRAWER_WIDTH_OPEN = "255px";
const DRAWER_WIDTH_CLOSED = "56px";


const WhiteSideBar = () => {
    const {isMobile} = useMobile();
    const [open, setOpen] = useState(!isMobile);
    const {signout} = useContext(UserContext);
    const {contacts, contactsIds} = useContext(ContactsContext);
    const {pairId, setPairId, sessions, selectedSession, setSelectedSession} = useContext(ChatContext);
    const navigate = useNavigate();


    useEffect(() => {
        setOpen(!isMobile)
    }, [isMobile]);


    const routingItemStyle = {
        cursor: 'pointer',
        backgroundColor: '#009688',
        margin: '5px 0',
        borderRadius: 2,
        '&:hover': {
            backgroundColor: '#00c098',
        },
    };

    const headersStyle = {
        backgroundColor: '#e0e0e0',
        margin: '5px 0',
        borderRadius: 2,
    };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


    const handleMenu = (event: any) => {
        setAnchorEl(event.currentTarget);
    };


    const handleClose = () => {
        setAnchorEl(null);
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
                        onClick={handleMenu}
                        sx={{...routingItemStyle}}
                    >
                        <ListItemIcon><MenuIcon/></ListItemIcon>
                        {open && <ListItemText primary="Menu"/>}
                    </ListItem>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => navigate("/settings")}>
                            <ListItemIcon>
                                <Settings/>
                            </ListItemIcon>
                            <ListItemText primary="Settings"/>
                        </MenuItem>
                        <MenuItem disabled onClick={() => navigate("/account")}>
                            <Avatar sx={{width: 24, height: 24}}>
                                {"u".toUpperCase()}
                            </Avatar>
                            <ListItemText primary="Manage Account"/>
                        </MenuItem>
                        <MenuItem onClick={() => navigate("/rnd")}>
                            <ListItemIcon>
                                <DeveloperMode/>
                            </ListItemIcon>
                            <ListItemText primary="Prompt R&D"/>
                        </MenuItem>
                        <MenuItem disabled onClick={() => navigate("/about")}>
                            <ListItemIcon>
                                <Info/>
                            </ListItemIcon>
                            <ListItemText primary="About"/>
                        </MenuItem>
                        <MenuItem onClick={() => signout()}>
                            <ListItemIcon>
                                <Logout/>
                            </ListItemIcon>
                            <ListItemText primary="Logout"/>
                        </MenuItem>
                    </Menu>


                    <br/> <Divider/>
                    <br/><ListItem
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
                            <ListItem> <Button variant={_id === selectedSession ? "contained" : "outlined"}
                                               key={_id}
                                               sx={{width: "100%"}} onClick={() => {
                                setSelectedSession(_id)
                                navigate("/chat")
                                if (isMobile) setOpen(false);
                            }}>{name}</Button> </ListItem>
                        ))}
                    <br/> <Divider/>
                    <br/>


                </List>
            </Drawer>
        </Box>
    );
};

export default WhiteSideBar;
