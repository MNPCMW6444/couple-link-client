import {Typography, Grid} from "@mui/material";
import {createContext, ReactNode} from "react";


const loadingMessage = (
    <Grid height="100vh" width="100vw" container justifyContent="center" alignItems="center">
        <Grid item>
            <Typography>
                Loading chat...
            </Typography>
        </Grid>
    </Grid>
);

const ChatContext = createContext<{
    triplets: any;
}>({
    triplets: 0
});

export const ChatContextProvider = ({children}: { children: ReactNode }) => {


    return (
        <ChatContext.Provider
            value={{
                triplets
            }}
        >
            {trur ? loadingMessage : children}
        </ChatContext.Provider>
    );
};

export default ChatContext;
