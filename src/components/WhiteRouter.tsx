import {useContext} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Box} from "@mui/material";
import WhiteSideBar from "./WhiteSideBar";
import UserContext from "../context/UserContext";
import ChatPage from "./pages/chat/ChatPage";
import Login from "./auth/Login";
import ContactsPage from "./pages/contacts/ContactsPage";
import HomePage from "./pages/home/HomePage";
import SessionsPage from "./pages/chat/SessionsPage";
import useMobile from "../hooks/responsiveness/useMobile";
import RND from "./pages/rnd/RND";

const Router = () => {

    const {user} = useContext(UserContext);

    const {isMobile} = useMobile()

    return (
        <BrowserRouter>
            {user ? (
                <Box overflow="hidden">
                    <WhiteSideBar/>
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            p: 3,
                            pt: isMobile
                                ? (theme) => theme.spacing(9)
                                : (theme) => theme.spacing(1), // Add top padding to account for the fixed AppBar
                            pl: isMobile
                                ? (theme) => theme.spacing(1)
                                : (theme) => theme.spacing(32), // Add left padding to account for the sidebar width when not on mobile
                        }}
                    >
                        <Routes>
                            <Route path="/*" element={<HomePage/>}/>
                            <Route path="/contacts"
                                   element={<ContactsPage/>}/>
                            <Route path="/sessions"
                                   element={<SessionsPage/>}/>
                            <Route path="/chat" element={<ChatPage/>}/>
                            <Route path="/rnd" element={<RND/>}/>
                        </Routes>
                    </Box>
                </Box>
            ) : (
                <Login/>
            )}
        </BrowserRouter>
    );
};

export default Router;
