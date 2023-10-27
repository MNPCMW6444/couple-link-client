import {Paper} from "@mui/material";
import ChatTriplet from "./ChatTriplet.tsx";
import {useContext} from "react";
import ChatContext from "../../../context/ChatContext.tsx";

const ChatPage = () => {

    const {triplets} = useContext(ChatContext)


    return <Paper sx={{overflow: "scroll"}}>
        {triplets.map((triplet, idx) => (
            <ChatTriplet key={idx} triplet={triplet}/>
        ))}    </Paper>
};

export default ChatPage