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
    const {contacts} = useContext(ContactsContext);
    const [message, setMessage] = useState<string>("");

    const myTurn = !(triplets[triplets.length - 1]?.me !== "" || (triplets[triplets.length - 1]?.me !== "" && triplets[triplets.length - 1]?.him !== "" && triplets[triplets.length - 1]?.ai !== ""));

    const handleCreateSession = () => {
        if (pairId) {
            createSession(pairId);
        }
    };


    return (

        <Paper sx={{overflow: "scroll", display: "flex", flexDirection: "column", height: "100%"}}>
            <Typography variant="h5">Chat Page</Typography>
            <Typography variant="subtitle1">Pair ID: {pairId}</Typography>
            <Select value={pairId} onChange={(e) => setPairId(e.target.value)} sx={{margin: '1em 0'}}>
                {contacts?.map((contact, idx) => (
                    <MenuItem key={idx} value={contact}>
                        {contact}
                    </MenuItem>
                ))}
            </Select>

            <Select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value as string)}
                    sx={{margin: '1em 0'}}>
                {sessions.map((session, idx) => <MenuItem key={idx} value={session}>{session}</MenuItem>)}
            </Select>
            {pairId ? (
                <Button variant="contained" color="secondary" onClick={handleCreateSession}>
                    Create Session
                </Button>
            ) : null}
            {triplets.map((triplet, idx) => <ChatTriplet key={idx} triplet={triplet}/>)}
            <div style={{display: 'flex', alignItems: 'center', padding: '1em'}}>
                <TextField
                    disabled={!myTurn}
                    value={myTurn ? message : "Wait for your turn...."} onChange={(e) => setMessage(e.target.value)}
                    variant="outlined" fullWidth
                    placeholder="Type a message..."/>
                <Button
                    disabled={!myTurn}
                    variant="contained" color="primary" onClick={() => {
                    sendMessage(selectedSession, message);
                    setMessage("");
                }}>
                    Send
                </Button>
            </div>
        </Paper>
    );
};

export default ChatPage;
