import {useContext, useState} from 'react';
import {Grid, Typography, Button, Tab, Tabs, Box, TextField, Divider, Badge} from '@mui/material';
import {Add, Cancel, DeleteForever, Edit} from '@mui/icons-material';
import {gql, useMutation} from '@apollo/client';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ContactsContext from '../../../context/ContactsContext';
import PropTypes from 'prop-types';
import useMobile from "../../../hooks/responsiveness/useMobile";


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

const ContactsPage = () => {
    const {
        contacts,
        invitations,
        sentInvitations,
        acceptInvitation,
        giveName,
        contactsQuery,
        deleteSomeone
    } = useContext(ContactsContext);
    const [invite, setInvite] = useState(false);
    const [phone, setPhone] = useState("");
    const [contactName, setContactName] = useState("");
    const [editingContact, setEditingContact] = useState<any>(null);
    const [newName, setNewName] = useState("");
    const [tabValue, setTabValue] = useState(0);
    const {isMobile, isMobileOrTabl} = useMobile();

    const handleChangeTab = (_: any, newValue: number) => {
        setTabValue(newValue);
    };

    const [doInvite] = useMutation(gql`
        mutation Newpair($contactPhone: String!, $name: String) {
          newpair(contactPhone: $contactPhone, name: $name)
        }
    `);


    const handleInvite = async () => {
        try {
            await doInvite({variables: {contactPhone: phone, name: contactName}});
            setInvite(false);
        } catch (error) {
            console.error("Error sending invitation:", error);
        }
    };


    const handleEditName = (contact: any) => {
        setEditingContact(contact);
        setNewName(contact.name || "");
    };

    const handleSaveName = async () => {
        if (editingContact) {
            await giveName({variables: {pairId: editingContact.pairId, name: newName}});
            contactsQuery.refetch();
            setEditingContact(null);
        }
    };

    const handleDeleteContact = (pairId: string) => deleteSomeone && deleteSomeone(pairId, false)
    const handleDeleteInvitataion = (pairId: string) => deleteSomeone && deleteSomeone(pairId, true)
    const withdraw = (number: string) => deleteSomeone && deleteSomeone(number, true)

    return (
        <Grid container justifyContent="center" sx={{width: '100%', flexGrow: 1, height: "100vh"}}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography variant={isMobile ? "h3" : "h1"} align="center" gutterBottom>
                    Contacts
                </Typography>
                <Tabs value={tabValue} onChange={handleChangeTab} centered>
                    <Tab label="Contacts" {...a11yProps(0)} />
                    <Tab label={
                        <Badge badgeContent={invitations.length} color="secondary"
                               anchorOrigin={{
                                   vertical: 'top',
                                   horizontal: 'right',
                               }}
                               sx={{
                                   '& .MuiBadge-badge': {
                                       right: -3,
                                       top: 0,
                                       border: `2px solid white`,
                                   },
                               }}
                        >
                            <span style={{paddingRight: '5px'}}>Invitations</span>
                        </Badge>
                    }  {...a11yProps(1)} />
                    <Tab label="Sent Invitations" {...a11yProps(2)} />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                    <Grid container direction="column" rowSpacing={2} alignItems="center">
                        {!invite ? (
                            <Grid item>
                                <Button variant="contained" onClick={() => setInvite(true)} startIcon={<Add/>}>
                                    Invite New
                                </Button>
                            </Grid>
                        ) : (<>
                                <Grid item>
                                    <PhoneInput
                                        country={'il'}
                                        value={phone}
                                        onChange={setPhone}
                                        containerStyle={{width: '100%'}}
                                        inputStyle={{width: '100%'}}
                                        placeholder="Enter phone number"
                                        enableSearch={true}
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        label="Contact Name"
                                        variant="outlined"
                                        value={contactName}
                                        onChange={(e) => setContactName(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item container justifyContent="space-around">
                                    <Grid item>
                                        <Button variant="outlined" onClick={() => setInvite(false)} sx={{mt: 2}}>
                                            Cancel
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" onClick={handleInvite} sx={{mt: 2, mr: 1}}>
                                            Send
                                        </Button>
                                    </Grid>
                                </Grid></>
                        )}
                    </Grid>
                    <br/>
                    <Divider/>
                    <br/>
                    <Grid container direction="column" rowSpacing={2}>
                        {contacts?.map((contact) => (
                            <Grid item container justifyContent="space-between" alignItems="center" key={contact.pairId}
                                  columnSpacing={2}>
                                <Grid item width="30%">
                                    <Typography variant="h6" sx={{mt: 1}}>
                                        {contact.name || contact.phone}
                                    </Typography>
                                </Grid>
                                {!(editingContact?.pairId === contact.pairId) &&
                                    (<>
                                        <Grid item>
                                            <Button variant="contained" onClick={() => handleEditName(contact)}> <Edit
                                                sx={{marginRight: 2}}/>
                                                {!isMobileOrTabl && "Edit Name"}
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button variant="contained"
                                                    onClick={() => handleDeleteContact(contact.pairId)}>
                                                <DeleteForever
                                                    sx={{marginRight: 2}}/>
                                                {!isMobileOrTabl && "Remove"}
                                            </Button>
                                        </Grid>
                                    </>)}
                                {editingContact?.pairId === contact.pairId && (
                                    <>
                                        <Grid item>
                                            <TextField
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                sx={{width: 120}}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Button variant="contained" onClick={handleSaveName}>Save</Button>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <Grid container rowSpacing={2}>
                        {invitations?.map((invitation, index) => (
                            <Grid item container spacing={2} alignItems="center" key={`invitation-${index}`}>
                                <Grid item xs={6}>
                                    <Typography variant="h6">{invitation}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Button
                                        variant="contained"
                                        onClick={() => acceptInvitation && acceptInvitation({variables: {phone: invitation}})}
                                    >
                                        Accept
                                    </Button>
                                </Grid>
                                <Grid item xs={3}>
                                    <Button variant="contained"
                                            onClick={() => handleDeleteInvitataion(invitation)}>
                                        <DeleteForever
                                            sx={{marginRight: 2}}/>
                                        {!isMobileOrTabl && "Remove"}
                                    </Button>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    <Grid container rowSpacing={2}>
                        {sentInvitations?.map((sentInvitation, index) => (
                            <Grid item container justifyContent="space-around">
                                <Grid item>
                                    <Typography variant="h6" key={`sentInvitation-${index}`} sx={{mt: 1}}>
                                        {sentInvitation}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Button onClick={() => withdraw(sentInvitation)} variant="contained"> <Cancel
                                        sx={{paddingRight: 1}}/>Withdraw</Button>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>
            </Grid>
        </Grid>
    )
        ;
};

export default ContactsPage;
