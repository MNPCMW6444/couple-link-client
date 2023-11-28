import {useContext} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Box, useTheme} from "@mui/material";
import WhiteSideBar from "./WhiteSideBar";
import UserContext from "../context/UserContext";
import ChatPage from "./pages/chat/ChatPage";
import Login from "./auth/Login";
import ContactsPage from "./pages/contacts/ContactsPage";
import HomePage from "./pages/home/HomePage";
import SessionsPage from "./pages/chat/SessionsPage";
import useMobile from "../hooks/responsiveness/useMobile";
import Roles from "./pages/rnd/Roles.tsx";
import SettingsPage from "./pages/settings/SettingsPage.tsx";
import NotificationsTab from "./pages/settings/NotificationsTab.tsx";
import {RNDContextProvider} from "../context/RNDContext.tsx";
import Sets from "./pages/rnd/Sets.tsx";
import ShopPage from "./pages/shop/ShopPage.tsx";


const Router = () => {

    const {user} = useContext(UserContext);

    const {isMobile} = useMobile()


    const backgroundColor = useTheme().palette.background.default; // Get default background color from theme


    return (
        <BrowserRouter>
            {user ? (
                <Box overflow="hidden" style={{backgroundColor}}> {/* Apply the background color */}
                    <WhiteSideBar/>
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            p: 3,
                            backgroundColor,
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
                                   element={<RNDContextProvider><SessionsPage/></RNDContextProvider>}/>
                            <Route path="/chat" element={<ChatPage/>}/>
                            <Route path="/roles" element={<RNDContextProvider><Roles/></RNDContextProvider>}/>
                            <Route path="/sets" element={<RNDContextProvider><Sets/></RNDContextProvider>}/>
                            <Route path="/settings" element={<SettingsPage/>}/>
                            <Route path="/notifications" element={<NotificationsTab/>}/>
                            <Route path="/shop" element={<ShopPage/>}/>
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
