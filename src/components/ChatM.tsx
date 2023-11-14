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

    const [placeHolder, setPlaceHolder] = useState<boolean>(true);
    const contactsX = ["📞 Select a Contact", ...(contacts || [])];

    return <>
        <Grid container justifyContent="space-between" alignItems="center" wrap="nowrap" width={DRAWER_WIDTH_OPEN - 5}>
            <Grid item xs>
                <Select
                    fullWidth
                    value={contacts[contactsIds.findIndex(id => id === pairId)] || contactsX[0]}
                    onChange={(e) => {
                        setPlaceHolder(false);
                        setPairId(contactsIds[contacts.findIndex(number => number === e.target.value)]);
                    }}
                    sx={{width: "100%", margin: '1em 0'}}
                >
                    {(placeHolder ? contactsX : contacts)?.map((contact, idx) => (
                        <MenuItem key={idx} value={contact}>{contact}</MenuItem>
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
            sessions.length > 4 ?
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
                ))
        }
    </>
}

export default ChatM