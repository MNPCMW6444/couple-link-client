import {useContext, useState} from 'react';
import {Grid, Typography, Button, Tab, Tabs, Box} from '@mui/material';
import {Add} from '@mui/icons-material';
import {gql, useMutation} from '@apollo/client';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ContactsContext from '../../../context/ContactsContext.tsx';
import PropTypes from 'prop-types';

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

const a11yProps = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
};

const HomePage = () => {
    const {contacts, invitations, sentInvitations, acceptInvitation} = useContext(ContactsContext);
    const [invite, setInvite] = useState(false);
    const [phone, setPhone] = useState("");
    const [tabValue, setTabValue] = useState(0);

    const [doInvite] = useMutation(gql`
    mutation Mutation($contactPhone: String!) {
      newpair(contactPhone: $contactPhone)
    }
  `);

    const handleInvite = () => {
        doInvite({variables: {contactPhone: phone}});
        setInvite(false);
    };

    const handleChangeTab = (newValue: any) => {
        setTabValue(newValue);
    };

    return (
        <Grid container justifyContent="center" sx={{width: '100%', flexGrow: 1}}>
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <Typography variant="h1" align="center" gutterBottom>
                    Contacts
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

export default HomePage;
