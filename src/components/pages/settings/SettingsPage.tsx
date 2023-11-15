import {cloneElement, useState} from 'react';
import {Tabs, Tab, Container, Paper, Box, Avatar} from '@mui/material';
import {useNavigate} from "react-router-dom";
import {DeveloperMode, Info, Logout, Notifications} from "@mui/icons-material";

export const menuData =
    [
        {
            name: "Notifications",
            icon: <Notifications/>,
            link: "/notifications",
            disabled: false
        },
        {
            name: "Manage Account",
            icon: "x",
            link: "/account",
            disabled: true
        },
        {
            name: "Prompt R&D",
            icon: <DeveloperMode/>,
            link: "/rnd",
            disabled: false
        },
        {
            name: "About",
            icon: <Info/>,
            link: "/about",
            disabled: true
        },
        {
            name: "Logout",
            icon: <Logout/>,
            link: "logout",
            disabled: false
        }];


const CustomTab = ({label, icon, disabled, ...otherProps}: {
    label: string,
    icon: JSX.Element | "x",
    disabled: boolean
}) => {
    return (
        <Tab
            {...otherProps}
            label={
                <Box display="flex" alignItems="center">
                    {icon === "x" ? <Avatar sx={{width: 24, height: 24, marginRight: '8px'}}>
                        {"u".toUpperCase()}
                    </Avatar> : cloneElement(icon, {style: {marginRight: '8px'}})}
                    {label}
                </Box>
            }
        />
    );
};

const Refer = ({toLink}: { toLink: number }) => {
    const navigate = useNavigate();
    navigate(menuData[toLink].link);
    return "loading..."
}


const SettingPage = () => {
    const [activeTab, setActiveTab] = useState<number>(0);


    return (
        <Container>
            <Paper elevation={3}>
                <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
                    {menuData?.map(({name, icon, disabled}, index) => (
                        <CustomTab
                            key={index}
                            icon={icon as JSX.Element}
                            label={name}
                            disabled={disabled}
                        />
                    ))}
                </Tabs>
                <br/><br/><br/>
                {<Refer toLink={activeTab}/>}
            </Paper>
        </Container>
    );
};

export default SettingPage;
