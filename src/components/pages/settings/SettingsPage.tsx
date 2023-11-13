import {cloneElement, useState} from 'react';
import {Tabs, Tab, Container, Paper, Box, Avatar} from '@mui/material';
import {menuData} from "../../WhiteSideBar.tsx";
import {useNavigate} from "react-router-dom";

const CustomTab = ({label, icon, ...otherProps}: { label: string, icon: JSX.Element | "x" }) => {
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
    navigate(menuData.items[toLink].link);
    return "loading..."
}


const SettingPage = () => {
    const [activeTab, setActiveTab] = useState<number>(0);

    const tabs = !menuData.sideBarAndNotTabs && menuData.items;

    return (
        <Container>
            <Paper elevation={3}>
                {tabs &&
                    <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
                        {tabs.map(({name, icon, disabled}, index) => (
                            <CustomTab
                                key={index}
                                icon={icon as JSX.Element}
                                label={name}
                                disabled={disabled}
                            />
                        ))}
                    </Tabs>}
                <br/><br/><br/>
                {<Refer toLink={activeTab}/>}
            </Paper>
        </Container>
    );
};

export default SettingPage;
