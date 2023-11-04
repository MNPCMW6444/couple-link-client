import {useContext, useState, MouseEvent} from "react";
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
    Divider, useMediaQuery, Select, Button,
} from "@mui/material";
import {
    Menu as MenuIcon,
    MenuOpen,
    Close, ArrowDownward, Contacts, Chat,
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import UserContext from "../context/UserContext.tsx";
import ContactsContext from "../context/ContactsContext.tsx";
import ChatContext from "../context/ChatContext.tsx";

const DRAWER_WIDTH_OPEN = "200px"; // Adjust as needed
const DRAWER_WIDTH_CLOSED = "56px"; // Adjust as needed

const WhiteSideBar = () => {
    const isMobile = useMediaQuery('(max-width: 600px)');
    const [open, setOpen] = useState<boolean>(!isMobile);
    const {user, signout} = useContext(UserContext);

    const {contacts, contactsIds} = useContext(ContactsContext);
    const {pairId, setPairId, sessions, selectedSession, setSelectedSession, createSession} = useContext(ChatContext);

    const navigateX = useNavigate();
    const navigate = (x: string) => {
        navigateX(x);
        isMobile && setOpen(false);
    };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: MouseEvent<HTMLElement>) => {
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
                sx={{
                    width: open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
                        transition: ".3s width", // Optional: This will add a smooth transition effect when toggling
                    },
                }}
            >
                <List>
                    {" "}
                    {isMobile && (
                        <ListItem sx={{cursor: "pointer", backgroundColor: "#8A307F50", borderRadius: "5px"}}
                                  onClick={() => setOpen(!open)}>
                            <ListItemIcon>{open ? <Close/> : <MenuIcon/>}</ListItemIcon>
                        </ListItem>
                    )}
                    <ListItem sx={{cursor: "pointer", backgroundColor: "#8A307F50", borderRadius: "5px"}}
                              onClick={handleMenu}>
                        <ListItemIcon>
                            <Avatar sx={{width: 24, height: 24}}>
                                {user?.number}
                            </Avatar>
                        </ListItemIcon>
                        {open && <ListItemText primary="Menu"/>}
                    </ListItem>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => {
                            navigate("/my-account")
                        }}>
                            Settings
                        </MenuItem>
                        <MenuItem onClick={() => {
                            navigate("/about")
                        }}>
                            About Braikup
                        </MenuItem>
                        <MenuItem onClick={() => signout()}>
                            Logout
                        </MenuItem>
                    </Menu>
                    <Divider/>


                    <ListItem>
                        <ListItemIcon>
                            <ArrowDownward sx={{paddingLeft: open ? "70px" : 0}}/>
                        </ListItemIcon>
                    </ListItem>
                    <ListItem sx={{cursor: "pointer", backgroundColor: "#8A307F50", borderRadius: "5px"}}
                              onClick={() => {
                                  /*
                                                                    axiosInstance?.post("analytics/sidebar", {route: "backlog"});
                                  */
                                  navigate("/contacts")
                              }}>
                        <ListItemIcon>
                            <Contacts/>
                        </ListItemIcon>
                        {open && <ListItemText primary="Manage Contacts"/>}
                    </ListItem>
                    <Divider/>


                    <ListItem sx={{cursor: "pointer", backgroundColor: "#8A307F50", borderRadius: "5px"}}>
                        {open && <ListItemText primary="Switch Contact:"/>}

                    </ListItem>

                    <ListItem sx={{cursor: "pointer", backgroundColor: "#8A307F50", borderRadius: "5px"}}>
                        <Select value={contacts[contactsIds.findIndex((id) => id === pairId)]}
                                onChange={(e) => setPairId(contactsIds[contacts.findIndex((number) => number === e.target.value)])}
                                sx={{margin: '1em 0'}}>
                            {contacts?.map((contact, idx) => (
                                <MenuItem key={idx} value={contact}>
                                    {contact}
                                </MenuItem>
                            ))}
                        </Select>
                    </ListItem>


                    <ListItem>
                        <ListItemIcon>
                            <ArrowDownward sx={{paddingLeft: open ? "70px" : 0}}/>
                        </ListItemIcon>
                    </ListItem>


                    <ListItem sx={{cursor: "pointer", backgroundColor: "#8A307F50", borderRadius: "5px"}}
                              onClick={() => {
                                  /*
                                                                    axiosInstance?.post("analytics/sidebar", {route: "deck"});
                                  */
                                  navigate("/chat")
                              }}>
                        <ListItemIcon>
                            <Chat/>
                        </ListItemIcon>
                        {open && <ListItemText primary="Chats"/>}
                    </ListItem>


                    <ListItem sx={{cursor: "pointer", backgroundColor: "#8A307F50", borderRadius: "5px"}}>
                        {open && <ListItemText primary="Switch Session:"/>}
                    </ListItem>

                    <ListItem sx={{cursor: "pointer", backgroundColor: "#8A307F50", borderRadius: "5px"}}>
                        <Select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value as string)}
                                sx={{margin: '1em 0'}}>
                            {sessions.map((session, idx) => <MenuItem key={idx} value={session}>{session}</MenuItem>)}
                        </Select>
                        {pairId ? (
                            <Button variant="contained" color="secondary"
                                    onClick={() => pairId && createSession(pairId)}>
                                Create Session
                            </Button>
                        ) : null}
                    </ListItem>

                </List>
            </Drawer>
        </Box>
    );
};

export default WhiteSideBar;
