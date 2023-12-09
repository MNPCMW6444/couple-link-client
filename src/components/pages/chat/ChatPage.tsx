import {
    Button,
    TextField,
    Box,
    Grid,
    Typography,
    Select,
    MenuItem,
    Divider,
    ListItemText,
    Theme,
    IconButton, ListItem
} from "@mui/material";
import ChatTriplet from "./ChatTriplet";
import {useContext, useEffect, useState} from "react";
import ChatContext from "../../../context/ChatContext";
import useMobile from "../../../hooks/responsiveness/useMobile.ts";
import {DRAWER_WIDTH_OPEN} from "../../WhiteSideBar.tsx";
import {Settings} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import ContactsContext from "../../../context/ContactsContext.tsx";
import {envVis} from "../../../App.tsx";

const ChatPage = () => {
    const [message, setMessage] = useState("");
    const {
        pairId,
        refetch,
        triplets,
        setPairId,
        sessions,
        selectedSession,
        setSelectedSession
    } = useContext(ChatContext);


    const isMyTurn = triplets && triplets[triplets.length - 1]?.me === "" && triplets[triplets.length - 1]?.ai === "";
    const [myTurn, setMyTurn] = useState(isMyTurn);

    const {isMobile} = useMobile()

    const {sendMessage} = useContext(ChatContext);

    useEffect(() => {
        setMyTurn(isMyTurn);
        const lastTriplet = triplets && triplets[triplets.length - 1];
        if (lastTriplet) {
            const {me, him, ai} = lastTriplet;
            me !== "" && him !== "" && ai !== "" && refetch && refetch();
        }
    }, [triplets, isMyTurn, refetch]);


    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const {contacts, contactsIds} = useContext(ContactsContext);

    const [placeHolderContacts, setPlaceHolderContacts] = useState<boolean>(true);
    const [placeHolderSessions, setPlaceHolderSessions] = useState<boolean>(true);
    const contactsX = [{name: "📞 Select a Contact"}, ...((contacts || []))];
    const sessionsX = [{
        __typename: "session", name: "💬 Select a Session", _id: "💬 Select a Session"
    }, ...(sessions || [])];


    return selectedSession ? (
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}>
                <Box sx={{
                    overflow: "auto",
                    flexGrow: 1,
                    px: 2,
                    height: isMobile ? envVis.height.mobile : envVis.height.desktop
                }}>
                    {triplets?.map((triplet, idx) => (
                        <ChatTriplet key={idx} triplet={triplet}/>
                    ))}
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', p: 1}}>
                    <TextField
                        disabled={!myTurn}
                        value={myTurn ? message : "Wait for your turn..."}
                        onChange={(e) => setMessage(e.target.value)}
                        variant="outlined"
                        fullWidth
                        placeholder="Type a message..."
                    />
                    <Box sx={{width: '1em'}}/>
                    <Button
                        disabled={!myTurn}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            sendMessage(selectedSession, message);
                            setMessage("");
                        }}>
                        Send
                    </Button>
                </Box>
            </Box>
        )
        :
        <Grid container direction="column" justifyContent="center" alignItems="center" height="100vh">
            <Grid item>
                <Typography variant={isMobile ? "h6" : "h4"} textAlign="center" color="gray">
                    Choose a contact and a session to start chatting:
                </Typography>
            </Grid>
            <Grid item>

                <>
                    <Grid container justifyContent="space-between" alignItems="center" wrap="nowrap"
                          width={DRAWER_WIDTH_OPEN - 5}>
                        <Grid item xs>
                            <Select
                                fullWidth
                                value={contacts[contactsIds.findIndex((id: any) => id === pairId)] || contactsX[0]}
                                onChange={(e) => {
                                    setPlaceHolderContacts(false);
                                    setPlaceHolderSessions(true);
                                    setPairId(contactsIds[contacts.findIndex(number => number === e.target.value)]);
                                }}
                                sx={{width: "90%", margin: '1em 0', marginLeft: "5%"}}
                            >
                                {(placeHolderContacts ? contactsX : contacts)?.map((contact: any, index) => (
                                    <MenuItem key={index} value={contact}>{contact.name || contact.phone}</MenuItem>
                                ))}
                                <Divider/>
                                <MenuItem onClick={() => handleNavigation("/contacts")}>
                                    <ListItemText primary="Manage"
                                                  sx={(theme: Theme): any => ({color: theme.palette.primary.main})}
                                    />
                                </MenuItem>
                            </Select>
                        </Grid>
                        <Grid item>
                            <IconButton onClick={() => handleNavigation("/contacts")}><Settings
                                sx={(theme: Theme): any => ({color: theme.palette.primary.main})}/></IconButton>
                        </Grid>
                    </Grid>
                    {pairId && (sessions?.length > 6 ?
                        <Grid container justifyContent="space-between" alignItems="center" wrap="nowrap"
                              width={DRAWER_WIDTH_OPEN - 5}>
                            <Grid item xs>
                                <Select
                                    fullWidth
                                    value={placeHolderSessions ? sessionsX[0].name : (selectedSession || sessionsX[0])}
                                    onChange={(e: any) => {
                                        setPlaceHolderSessions(false);
                                        setSelectedSession(e.target.value);
                                        handleNavigation("/chat")
                                    }}
                                    sx={{width: "90%", margin: '1em 0', marginLeft: "5%"}}
                                >
                                    {(placeHolderSessions ? sessionsX : sessions)?.map(({_id, name}: any) => (
                                        <MenuItem key={_id} value={_id}>{name}</MenuItem>
                                    ))}
                                    <Divider/>
                                    <MenuItem onClick={() => handleNavigation("/sessions")}>
                                        <ListItemText primary="Manage"
                                                      sx={(theme: Theme): any => ({color: theme.palette.primary.main})}/>
                                    </MenuItem>
                                </Select>
                            </Grid>
                            <Grid item>
                                <IconButton onClick={() => handleNavigation("/sessions")}><Settings
                                    sx={(theme: Theme): any => ({color: theme.palette.primary.main})}/></IconButton>
                            </Grid>
                        </Grid>
                        :
                        <>
                            {sessions?.map(({_id, name}) => (
                                <ListItem key={_id}>
                                    <Button
                                        variant={_id === selectedSession ? "contained" : "outlined"}
                                        sx={{width: "100%"}}
                                        onClick={() => {
                                            setSelectedSession(_id)
                                            handleNavigation("/chat")
                                        }}
                                    >
                                        {name}
                                    </Button>
                                </ListItem>
                            ))}
                            <ListItem>
                                <Button
                                    variant="contained"
                                    sx={{width: "100%"}}
                                    onClick={() => handleNavigation("/sessions")}
                                >
                                    Manage
                                </Button>
                            </ListItem>
                        </>)}
                </>


            </Grid>
        </Grid>;
};

export default ChatPage;
