import {Paper, Button, TextField} from "@mui/material";
import ChatTriplet from "./ChatTriplet.tsx";
import {useContext, useState} from "react";
import ChatContext from "../../../context/ChatContext.tsx";

const ChatPage = () => {
    const {
        selectedSession,
        triplets,
    } = useContext(ChatContext);
    const [message, setMessage] = useState<string>("");

    const myTurn = !(triplets[triplets.length - 1]?.me !== "" || (triplets[triplets.length - 1]?.me !== "" && triplets[triplets.length - 1]?.him !== "" && triplets[triplets.length - 1]?.ai !== ""));

    const {sendMessage} = useContext(ChatContext);

    return (
        <Paper
            sx={{
                overflow: "scroll",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: "90vh",
                justifyContent: "space-between"
            }}>
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
