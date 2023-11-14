import {Button, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select} from "@mui/material";
import {ChatOutlined, ContactsOutlined} from "@mui/icons-material";
import {Dispatch, SetStateAction, useContext} from "react";
import ContactsContext from "../context/ContactsContext.tsx";
import ChatContext from "../context/ChatContext.tsx";
import {useNavigate} from "react-router-dom";
import {routingItemStyle} from "./WhiteSideBar.tsx";
import useMobile from "../hooks/responsiveness/useMobile.ts";


const headersStyle = {
    backgroundColor: '#e0e0e0',
    margin: '5px 0',
    borderRadius: 2,
};

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


    return <>
        <ListItem onClick={() => handleNavigation("/contacts")} sx={routingItemStyle}>
            <ListItemIcon><ContactsOutlined/></ListItemIcon>
            {open && <ListItemText primary="Manage Contacts"/>}
        </ListItem>
        <ListItem sx={headersStyle}>
            <ListItemIcon><ContactsOutlined/></ListItemIcon>
            {open && <ListItemText primary="Switch Contact:"/>}
        </ListItem>
        <Select
            value={contacts[contactsIds.findIndex(id => id === pairId)] || ''}
            onChange={(e) => setPairId(contactsIds[contacts.findIndex(number => number === e.target.value)])}
            sx={{width: '100%', margin: '1em 0'}}
        >
            {contacts?.map((contact, idx) => (
                <MenuItem key={idx} value={contact}>{contact}</MenuItem>
            ))}
        </Select>
        <Divider/>
        <ListItemButton
            onClick={() => handleNavigation("/sessions")}
            sx={routingItemStyle}
            disabled={!pairId}
        >
            <ListItemIcon><ChatOutlined/></ListItemIcon>
            {open && <ListItemText primary="Manage Chats"/>}
        </ListItemButton>
        <ListItem sx={headersStyle} disabled={!pairId}>
            <ListItemIcon><ChatOutlined/></ListItemIcon>
            {open && <ListItemText primary="Switch Chat:"/>}
        </ListItem>
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