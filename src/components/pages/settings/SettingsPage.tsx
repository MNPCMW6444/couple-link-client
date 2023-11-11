import {useState} from 'react';
import {Tabs, Tab, Container, Paper} from '@mui/material';
import NotificationsTab from "./NotificationsTab.tsx";

const SettingPage = () => {
    const [activeTab, setActiveTab] = useState<number>(0);


    return (
        <Container>
            <Paper elevation={3}>
                <Tabs value={activeTab} onChange={(_, newValue) => {
                    setActiveTab(newValue);
                }}>
                    <Tab label="Notifications"/>
                </Tabs>
                <br/><br/><br/>
                {activeTab === 0 && <NotificationsTab/>}
            </Paper>
        </Container>
    );
};

export default SettingPage;
