import {Typography, Grid} from "@mui/material";
import {createContext, ReactNode} from "react";

const example = [

    {me: "sdfsdfd11111esfewf", him: "Wefew2222fewf12222ewgewgf", ai: "Edgfe3333333rgergreg"},
    {
        me: "sdfsdfd11111esfewf",
        him: "Wefew2222fewf12222ewgewgf",
        ai: "Edgfe3333333rgergregEdgfe3333333rgergregEdgfe3333333rgergregEdgfe3333333rgergregEdgfe3333333rgergregEdgfe3333333rgergregEdgfe3333333rgergregEdgfe3333333rgergregEdgfe3333333rgergreg"
    },
    {
        me: "sdfsdfd11111esfewf",
        him: "Wefew2222fewf12222ewgewgfWefew2222fewf12222ewgewgfWefew2222fewf12222ewgewgfWefew2222fewf12222ewgewgfWefew2222fewf12222ewgewgf",
        ai: "Edgfe3333333rgergreg"
    },
    {
        me: "sdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewf",
        him: "Wefew2222fewf12222ewgewgf",
        ai: "Edgfe3333333rgergreg"
    },
    {me: "sdfsdfd11111esfewf", him: "Wefew2222fewf12222ewgewgf", ai: "Edgfe3333333rgergreg"}, {
        me: "sdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewf",
        him: "Wefew2222fewf12222ewgewgf",
        ai: "Edgfe3333333rgergreg"
    },
    {me: "sdfsdfd11111esfewf", him: "Wefew2222fewf12222ewgewgf", ai: "Edgfe3333333rgergreg"}, {
        me: "sdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewf",
        him: "Wefew2222fewf12222ewgewgf",
        ai: "Edgfe3333333rgergreg"
    },
    {me: "sdfsdfd11111esfewf", him: "Wefew2222fewf12222ewgewgf", ai: "Edgfe3333333rgergreg"}, {
        me: "sdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewf",
        him: "Wefew2222fewf12222ewgewgf",
        ai: "Edgfe3333333rgergreg"
    },
    {me: "sdfsdfd11111esfewf", him: "Wefew2222fewf12222ewgewgf", ai: "Edgfe3333333rgergreg"}, {
        me: "sdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewf",
        him: "Wefew2222fewf12222ewgewgf",
        ai: "Edgfe3333333rgergreg"
    },
    {me: "sdfsdfd11111esfewf", him: "Wefew2222fewf12222ewgewgf", ai: "Edgfe3333333rgergreg"}, {
        me: "sdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewf",
        him: "Wefew2222fewf12222ewgewgf",
        ai: "Edgfe3333333rgergreg"
    },
    {me: "sdfsdfd11111esfewf", him: "Wefew2222fewf12222ewgewgf", ai: "Edgfe3333333rgergreg"}, {
        me: "sdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewfsdfsdfd11111esfewf",
        him: "Wefew2222fewf12222ewgewgf",
        ai: "Edgfe3333333rgergreg"
    },
    {me: "sdfsdfd11111esfewf", him: "Wefew2222fewf12222ewgewgf", ai: "Edgfe3333333rgergreg"},
    {me: "sdfsdfd11111esfewf", him: "Wefew2222fewf12222ewgewgf", ai: "Edgfe3333333rgergreg"},


]


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
    triplets: { me: string, him: string, ai: string } [];
}>({
    triplets: example
});

export const ChatContextProvider = ({children}: { children: ReactNode }) => {

    const triplets = example

    return (
        <ChatContext.Provider
            value={{
                triplets
            }}
        >
            {true ? loadingMessage : children}
        </ChatContext.Provider>
    );
};

export default ChatContext;
