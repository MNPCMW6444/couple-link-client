import {Paper, Button, TextField} from "@mui/material";
import ChatTriplet from "./ChatTriplet";
import {useContext, useEffect, useState} from "react";
import ChatContext from "../../../context/ChatContext";

const ChatPage = () => {
    const {
        selectedSession,
        triplets,
        refetch
    } = useContext(ChatContext);
    const [message, setMessage] = useState<string>("");

    const [myTurn, setMyTurn] = useState<boolean>(triplets[triplets?.length - 1]?.me === ""
        &&
        triplets[triplets?.length - 1]?.ai === "");

    const {sendMessage} = useContext(ChatContext);

    useEffect(() => {
        setMyTurn(
            (
                triplets[triplets?.length - 1]?.me === ""
                &&
                triplets[triplets?.length - 1]?.ai === ""

            ));
        const xx = triplets[triplets?.length - 1];
        if (xx) {
            const {me, him, ai} = xx;
            me !== "" && him !== "" && ai !== "" && refetch && refetch();
        }

    }, [triplets])

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
            {triplets?.map((triplet, idx) => <ChatTriplet key={idx} triplet={triplet}/>)}
            <div style={{display: 'flex', alignItems: 'center', padding: '1em'}}>
                <TextField
                    disabled={!myTurn}
                    value={myTurn ? message : "Wait for your turn...."} onChange={(e) => setMessage(e.target.value)}
                    variant="outlined" fullWidth
                    placeholder="Type a message..."/>
                <div style={{width: '1em'}}/>
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
