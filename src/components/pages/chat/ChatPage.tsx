import {Paper, Select, MenuItem, Typography, Button, TextField} from "@mui/material";
import ChatTriplet from "./ChatTriplet.tsx";
import {useContext, useState} from "react";
import ChatContext from "../../../context/ChatContext.tsx";
import ContactsContext from "../../../context/ContactsContext.tsx";

const ChatPage: React.FC = () => {
    const {
        pairId,
        setPairId,
        sessions,
        selectedSession,
        setSelectedSession,
        triplets,
        sendMessage, createSession
    } = useContext(ChatContext);
    const {contactsIds} = useContext(ContactsContext);
    const [message, setMessage] = useState<string>("");


    const {} = useContext(ChatContext);

    const handleCreateSession = () => {
        if (pairId) {
            createSession(pairId);
        }
    };
    

    return (
        <>
            <Paper sx={{overflow: "scroll"}}>
                {triplets.map((triplet, idx) => (
                    <ChatTriplet key={idx} triplet={triplet}/>
                ))}
            </Paper>
            <Paper sx={{overflow: "scroll", display: "flex", flexDirection: "column", height: "100%"}}>
                <Typography variant="h5">Chat Page</Typography>
                <Typography variant="subtitle1">Pair ID: {pairId}</Typography>
                <Select value={pairId} onChange={(e) => setPairId(e.target.value as string)} sx={{margin: '1em 0'}}>
                    {contactsIds?.map((id, idx) => <MenuItem key={idx} value={id}>{id}</MenuItem>)}
                </Select>
                <Select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value as string)}
                        sx={{margin: '1em 0'}}>
                    {sessions.map((session, idx) => <MenuItem key={idx} value={session}>{session}</MenuItem>)}
                </Select>
                {sessions.length === 0 && pairId ? (
                    <Button variant="contained" color="secondary" onClick={handleCreateSession}>
                        Create Session
                    </Button>
                ) : null}
                {triplets.map((triplet, idx) => <ChatTriplet key={idx} triplet={triplet}/>)}
                <div style={{display: 'flex', alignItems: 'center', padding: '1em'}}>
                    <TextField value={message} onChange={(e) => setMessage(e.target.value)} variant="outlined" fullWidth
                               placeholder="Type a message..."/>
                    <Button variant="contained" color="primary" onClick={() => {
                        sendMessage(selectedSession, message);
                        setMessage("");
                    }}>
                        Send
                    </Button>
                </div>
            </Paper>
        </>
    );
};

export default ChatPage;
