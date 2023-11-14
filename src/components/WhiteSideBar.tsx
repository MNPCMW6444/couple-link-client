import {useEffect, useState} from "react";
import {
    Drawer,
    List,
    ListItem,
    IconButton,
    Box,
    Divider,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import {Menu as MenuIcon, MenuOpen, Close} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import useMobile from "../hooks/responsiveness/useMobile";
import ChatM from "./ChatM.tsx";

const DRAWER_WIDTH_OPEN = "255px";
const DRAWER_WIDTH_CLOSED = "56px";

export const routingItemStyle = {
    cursor: 'pointer',
    backgroundColor: '#009688',
    margin: '5px 0',
    borderRadius: 2,
    '&:hover': {
        backgroundColor: '#00c098',
    },
};


const WhiteSideBar = () => {
    const {isMobile} = useMobile();
    const [open, setOpen] = useState(!isMobile);

    const navigate = useNavigate();

    useEffect(() => setOpen(!isMobile), [isMobile]);

    const handleDrawerToggle = () => setOpen(!open);
    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) setOpen(false);
    };

    return (
        <Box>
            {isMobile && !open && (
                <IconButton onClick={handleDrawerToggle} sx={{position: "fixed", zIndex: 1201}}>
                    {open ? <MenuOpen/> : <MenuIcon/>}
                </IconButton>
            )}
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={isMobile ? open : true}
                onClose={handleDrawerToggle}
                sx={{
                    width: open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED,
                        transition: "width 0.3s",
                    },
                }}
            >
                <List>
                    {isMobile && (
                        <ListItem onClick={handleDrawerToggle} sx={{display: "flex", justifyContent: "center"}}>
                            <ListItemIcon>{open ? <Close sx={{backgroundColor: "#BBBBBB", borderRadius: 20}}/> :
                                <MenuIcon/>}</ListItemIcon>
                        </ListItem>
                    )}
                    <ListItem onClick={() => handleNavigation("/settings")} sx={routingItemStyle}>
                        <ListItemIcon><MenuIcon/></ListItemIcon>
                        {open && <ListItemText primary="Settings"/>}
                    </ListItem>
                    <Divider/>
                    <ChatM open={open} setOpen={setOpen}/>
                    <Divider/>
                </List>
            </Drawer>
        </Box>
    );
};

export default WhiteSideBar;
