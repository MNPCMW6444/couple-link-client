import {Button, TextField, Box} from "@mui/material";
import ChatTriplet from "./ChatTriplet";
import {useContext, useEffect, useState} from "react";
import ChatContext from "../../../context/ChatContext";
import useMobile from "../../../hooks/responsiveness/useMobile.ts";

const ChatPage = () => {
    const {selectedSession, triplets, refetch} = useContext(ChatContext);
    const [message, setMessage] = useState("");

    const isMyTurn = triplets[triplets.length - 1]?.me === "" && triplets[triplets.length - 1]?.ai === "";
    const [myTurn, setMyTurn] = useState(isMyTurn);

    const {isMobile} = useMobile()

    const {sendMessage} = useContext(ChatContext);

    useEffect(() => {
        setMyTurn(isMyTurn);
        const lastTriplet = triplets[triplets.length - 1];
        if (lastTriplet) {
            const {me, him, ai} = lastTriplet;
            me !== "" && him !== "" && ai !== "" && refetch && refetch();
        }
    }, [triplets, isMyTurn, refetch]);

    return (
        <Box sx={{
            height: isMobile ? "95vh" : "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
        }}>
            <Box sx={{overflow: "auto", flexGrow: 1, px: 2}}>
                {triplets?.map((triplet, idx) => (
                    <ChatTriplet key={idx} triplet={triplet}/>
                ))}
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', p: 1}}>
                <TextField
                    disabled={!myTurn}
                    value={myTurn ? message : "Wait for your turn..."}
                    onChange={(e) => setMessage(e.target.value)}
                    variant="outlined"
                    fullWidth
                    placeholder="Type a message..."
                />
                <Box sx={{width: '1em'}}/>
                <Button
                    disabled={!myTurn}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        sendMessage(selectedSession, message);
                        setMessage("");
                    }}>
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default ChatPage;
