import {
    Button, Divider,
    Grid, IconButton,
    ListItem,
    ListItemText,
    MenuItem,
    Select
} from "@mui/material";
import {Settings} from "@mui/icons-material";
import {Dispatch, SetStateAction, useContext, useState} from "react";
import ContactsContext from "../context/ContactsContext.tsx";
import ChatContext from "../context/ChatContext.tsx";
import {useNavigate} from "react-router-dom";
import {DRAWER_WIDTH_OPEN} from "./WhiteSideBar.tsx";
import useMobile from "../hooks/responsiveness/useMobile.ts";


interface ChatMProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

const ChatM = ({open, setOpen}: ChatMProps) => {
    const navigate = useNavigate();
    const {isMobile} = useMobile();

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) setOpen(false);
    };

    const {contacts, contactsIds} = useContext(ContactsContext);
    const {pairId, setPairId, sessions, selectedSession, setSelectedSession} = useContext(ChatContext);

    const [placeHolderContacts, setPlaceHolderContacts] = useState<boolean>(true);
    const [placeHolderSessions, setPlaceHolderSessions] = useState<boolean>(true);
    const contactsX = ["📞 Select a Contact", ...((contacts || []))];
    const sessionsX = [{
        __typename: "session", name: "💬 Select a Session", _id: "💬 Select a Session"
    }, ...(sessions || [])];


    return <>
        <Grid container justifyContent="space-between" alignItems="center" wrap="nowrap" width={DRAWER_WIDTH_OPEN - 5}>
            <Grid item xs>
                <Select
                    fullWidth
                    value={contacts[contactsIds.findIndex(id => id === pairId)] || contactsX[0]}
                    onChange={(e) => {
                        setPlaceHolderContacts(false);
                        setPlaceHolderSessions(true);
                        setPairId(contactsIds[contacts.findIndex(number => number === e.target.value)]);
                    }}
                    sx={{width: "90%", margin: '1em 0', marginLeft: "5%"}}
                >
                    {(placeHolderContacts ? contactsX : contacts)?.map((contact, index) => (
                        <MenuItem key={index} value={contact}>{contact}</MenuItem>
                    ))}
                    <Divider/>
                    <MenuItem onClick={() => handleNavigation("/contacts")}>
                        {open && <ListItemText primary="Manage" sx={{color: "#009688"}}/>}
                    </MenuItem>
                </Select>
            </Grid>
            <Grid item>
                <IconButton onClick={() => handleNavigation("/contacts")}><Settings
                    sx={{color: "#009688"}}/></IconButton>
            </Grid>
        </Grid>
        {
            sessions?.length > 3 ?
                <Grid container justifyContent="space-between" alignItems="center" wrap="nowrap"
                      width={DRAWER_WIDTH_OPEN - 5}>
                    <Grid item xs>
                        <Select
                            fullWidth
                            value={placeHolderSessions ? sessionsX[0].name : (selectedSession || sessionsX[0])}
                            onChange={(e: any) => {
                                setPlaceHolderSessions(false);
                                setSelectedSession(e.target.value);
                                handleNavigation("/chat")
                            }}
                            sx={{width: "90%", margin: '1em 0', marginLeft: "5%"}}
                        >
                            {(placeHolderSessions ? sessionsX : sessions)?.map(({_id, name}: any) => (
                                <MenuItem key={_id} value={_id}>{name}</MenuItem>
                            ))}
                            <Divider/>
                            <MenuItem onClick={() => handleNavigation("/contacts")}>
                                {open && <ListItemText primary="Manage" sx={{color: "#009688"}}/>}
                            </MenuItem>
                        </Select>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={() => handleNavigation("/sessions")}><Settings
                            sx={{color: "#009688"}}/></IconButton>
                    </Grid>
                </Grid>
                :
                <> {sessions?.map(({_id, name}) => (
                    <ListItem key={_id}>
                        <Button
                            variant={_id === selectedSession ? "contained" : "outlined"}
                            sx={{width: "100%"}}
                            onClick={() => {
                                setSelectedSession(_id)
                                handleNavigation("/chat")
                            }}
                        >
                            {name}
                        </Button>
                    </ListItem>
                ))}
                    <ListItem>
                        <Button
                            variant="contained"
                            sx={{width: "100%"}}
                            onClick={() => handleNavigation("/sessions")}
                        >
                            Manage
                        </Button>
                    </ListItem>

                </>
        }
    </>
}

export default ChatM