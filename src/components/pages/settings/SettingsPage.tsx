import {useContext, useState, useEffect} from 'react';
import {Tabs, Tab, Container, Avatar, useMediaQuery, useTheme} from '@mui/material';
import NotificationsTab from "./NotificationsTab.tsx";
import AccountTab from "./AccountTab.tsx";
import {Logout, Notifications} from "@mui/icons-material";
import UserContext from "../../../context/UserContext.tsx";

const SettingPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const {user, signout} = useContext(UserContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const menuData = [
        {
            name: "Manage Account",
            icon: <Avatar>{(user?.name || "u").toUpperCase()}</Avatar>,
            content: <AccountTab/>,
            disabled: false
        },
        {
            name: "Notifications",
            icon: <Notifications/>,
            content: <NotificationsTab/>,
            disabled: false
        },
        {
            name: "Logout",
            icon: <Logout/>,
            action: signout,
            disabled: false
        }
    ];

    const handleTabChange = (_: any, newValue: number) => {
        setActiveTab(newValue);
    };

    useEffect(() => {
        if (menuData[activeTab].action) {
            (menuData[activeTab].action as Function)();
        }
    }, [activeTab]);

    return (
        <Container>
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant={isMobile ? 'scrollable' : 'standard'}
                scrollButtons={isMobile ? 'auto' : false}
                allowScrollButtonsMobile
            >
                {menuData.map((item, index) => (
                    <Tab
                        key={index}
                        label={item.name}
                        icon={item.icon}
                        iconPosition="start"
                        disabled={item.disabled}
                    />
                ))}
            </Tabs>
            <br/><br/><br/>
            {menuData[activeTab].content}
        </Container>
    );
};

export default SettingPage;
