import {useContext, useState} from 'react';
import {Grid, Typography, Button, Tab, Tabs, Box} from '@mui/material';
import {Add} from '@mui/icons-material';
import {gql, useMutation} from '@apollo/client';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ContactsContext from '../../../context/ContactsContext';
import PropTypes from 'prop-types';
import useMobile from "../../../hooks/responsiveness/useMobile.ts";

const SUBSCRIBE_TO_PUSH = gql`
  mutation SubscribeToPush($subscription: JSON!) {
    subscribeToPush(subscription: $subscription)
  }
`;

const TabPanel = (props: any) => {
    const {children, value, index, ...other} = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const a11yProps = (index: any) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
};

const ContactsPage = () => {
    const {contacts, invitations, sentInvitations, acceptInvitation} = useContext(ContactsContext);
    const [invite, setInvite] = useState(false);
    const [phone, setPhone] = useState("");
    const [tabValue, setTabValue] = useState(0);
    const [subscribeToPush] = useMutation(SUBSCRIBE_TO_PUSH);
    const {isMobile} = useMobile();

    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    const handleSubscribeClick = () => {
        navigator.serviceWorker.ready.then((registration) => {
            registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('BOX9mgkzgqKdn0j6vi-86nqWXoo24Ir4NAPwLe3M-lHgZpBLT153asOtuX1ocALmL3aRzBWgoRhjDAC80-llb6g')
            })
                .then((subscription) => {
                    subscribeToPush({variables: {subscription: JSON.stringify(subscription)}});
                })
                .catch((error) => {
                    console.error('Error during getSubscription()', error);
                });
        });
    };

    const handleInvite = async () => {
        try {
            await doInvite({variables: {contactPhone: phone}});
            setInvite(false);
        } catch (error) {
            console.error("Error sending invitation:", error);
        }
    };

    const handleChangeTab = (_: any, newValue: any) => {
        setTabValue(newValue);
    };

    const [doInvite] = useMutation(gql`
    mutation Mutation($contactPhone: String!) {
      newpair(contactPhone: $contactPhone)
    }
  `);

    return (
        <Grid container justifyContent="center" sx={{width: '100%', flexGrow: 1}}>
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <Typography variant={isMobile ? "h3" : "h1"} align="center" gutterBottom onClick={handleSubscribeClick}>
                    Contacts and RfP
                </Typography>
                <Tabs value={tabValue} onChange={handleChangeTab} centered>
                    <Tab label="Contacts" {...a11yProps(0)} />
                    <Tab label="Invitations" {...a11yProps(1)} />
                    <Tab label="Sent Invitations" {...a11yProps(2)} />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                    {!invite ? (
                        <Button variant="contained" onClick={() => setInvite(true)} startIcon={<Add/>}>
                            Invite New
                        </Button>
                    ) : (
                        <>
                            <PhoneInput
                                country={'il'}
                                value={phone}
                                onChange={setPhone}
                                containerStyle={{width: '100%'}}
                                inputStyle={{width: '100%'}}
                                placeholder="Enter phone number"
                                enableSearch={true}
                            />
                            <Button variant="contained" onClick={handleInvite} sx={{mt: 2, mr: 1}}>
                                Send
                            </Button>
                            <Button variant="outlined" onClick={() => setInvite(false)} sx={{mt: 2}}>
                                Cancel
                            </Button>
                        </>
                    )}
                    {contacts.map((contact, index) => (
                        <Typography variant="h6" key={`contact-${index}`} sx={{mt: 1}}>
                            {contact}
                        </Typography>
                    ))}
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    {invitations.map((invitation, index) => (
                        <Grid container spacing={2} alignItems="center" key={`invitation-${index}`}>
                            <Grid item xs={8}>
                                <Typography variant="h6">{invitation}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Button
                                    variant="contained"
                                    onClick={() => acceptInvitation && acceptInvitation({variables: {phone: invitation}})}
                                >
                                    Accept
                                </Button>
                            </Grid>
                        </Grid>
                    ))}
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    {sentInvitations.map((sentInvitation, index) => (
                        <Typography variant="h6" key={`sentInvitation-${index}`} sx={{mt: 1}}>
                            {sentInvitation}
                        </Typography>
                    ))}
                </TabPanel>
            </Grid>
        </Grid>
    );
};

export default ContactsPage;
