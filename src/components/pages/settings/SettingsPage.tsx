import {useContext, useState} from 'react';
import {Tabs, Tab, Container, Paper, Avatar} from '@mui/material';
import NotificationsTab from "./NotificationsTab.tsx";
import AccountTab from "./AccountTab.tsx";
import {Logout, Notifications} from "@mui/icons-material";
import UserContext from "../../../context/UserContext.tsx";


const SettingPage = () => {
    const [activeTab, setActiveTab] = useState<number>(0);

    const {user} = useContext(UserContext)


    const {signout} = useContext(UserContext)

    const menuData = [

        {
            name: "Manage Account",
            icon: <Avatar>{(user?.name || "u").toUpperCase()}</Avatar>,
            disabled: false,
            content: <AccountTab/>
        },
        {
            name: "Notifications",
            icon: <Notifications/>,
            disabled: false,
            content: <NotificationsTab/>
        },
        {
            name: "Logout",
            icon: <Logout/>,
            disabled: false,
            action: () => signout()
        }
    ];


    return (
        <Container>
            <Paper elevation={3}>
                <Tabs value={activeTab} onChange={(_, newValue) => {
                    setActiveTab(newValue);
                }}>
                    {menuData.map((item, index) => (
                        <Tab
                            key={index}
                            label={item.name}
                            icon={item.icon}
                            iconPosition="start"
                            disabled={item.disabled}
                            onClick={item.action}
                        />

                    ))}
                </Tabs>
                <br/><br/><br/>
                {menuData[activeTab].content}
            </Paper>
        </Container>
    );
};

export default SettingPage;
