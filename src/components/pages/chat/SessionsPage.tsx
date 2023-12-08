import {useState, useContext, useEffect} from 'react';
import {
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Paper,
    Grid,
    Select,
    MenuItem, Typography, Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {gql, useMutation} from "@apollo/client";
import ChatContext from "../../../context/ChatContext";
import RNDContext from "../../../context/RNDContext";
import useMobile from "../../../hooks/responsiveness/useMobile.ts";
import ContactsContext from "../../../context/ContactsContext.tsx";
import {DRAWER_WIDTH_OPEN} from "../../WhiteSideBar.tsx";
import {DeleteForever, Shop} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import UserContext from "../../../context/UserContext.tsx";


const RENAME_SESSION_MUTATION = gql`
    mutation Renamesession($sessionId: String!, $newName: String!) {
      renamesession(sessionId: $sessionId, newName: $newName) {
        pairId
        name
        _id
        createdAt
        updatedAt
      }
    }
`

type Session = {
    _id: string;
    name: string;
}

const SessionsManager = () => {
    const {
        pairId,
        sessions,
        createSession,
        setSelectedSession, deleteSessionById
    } = useContext(ChatContext);

    const {myRoles: r, user} = useContext(UserContext);

    const [newSessionName, setNewSessionName] = useState('');
    const [editingSession, setEditingSession] = useState<Session | null>(null);
    const [renameValue, setRenameValue] = useState('');

    const [renameSession] = useMutation(RENAME_SESSION_MUTATION, {});

    const [selectedRoleId, setSelectedRoleId] = useState('654ec6a80e5eb4fc793dc5c9');

    const handleCreate = async () => {
        const x: any = await createSession(pairId, newSessionName, selectedRoleId);
        setNewSessionName('');
        setSelectedRoleId('');
        setSelectedSession(x.data.createsession._id);
        navigate("/chat")
    };

    const handleRename = async () => {
        await renameSession({
            variables: {
                sessionId: editingSession?._id,
                newName: renameValue,
            }
        });
        setRenameValue('');
        setEditingSession(null);
    };

    const {isMobile} = useMobile();


    const {data: rolesData} = useContext(RNDContext);

    const [placeHolderRoles, setPlaceHolderRoles] = useState<boolean>(true);
    /*
        const ex = {
            "__typename": "role",
            "creatorId": "654794b96e21979ecc40c0b1",
            "name": (Math.random() > 0.5 ? "🧑🏽‍" : "👨🏽‍") + " Select a Role",
            "publicName": null,
            "role": "wefew",
            "setId": "6552ae28c2399da91610c3fe",
            "category": "ergerg",
            "description": "ergergerg",
            "aiMessage": "[\"It seems like you have provided random characters for both sides. Can you please provide some context or a prompt so that I can generate a response or provide assistance?\",\"I'm sorry, but I'm unable to interpret the meaning behind \\\"rg3rg3r\\\" and \\\"3rg3\\\" as they do not appear to have any recognizable context or words. If you can provide more information or clarify the meaning, I'll be happy to assist you further.\",\"Error: {\\\"status\\\":429,\\\"headers\\\":{\\\"alt-svc\\\":\\\"h3=\\\\\\\":443\\\\\\\"; ma=86400\\\",\\\"cf-cache-status\\\":\\\"DYNAMIC\\\",\\\"cf-ray\\\":\\\"826a84c5e9d08e4e-TLV\\\",\\\"connection\\\":\\\"keep-alive\\\",\\\"content-length\\\":\\\"493\\\",\\\"content-type\\\":\\\"application/json; charset=utf-8\\\",\\\"date\\\":\\\"Wed, 15 Nov 2023 21:17:01 GMT\\\",\\\"server\\\":\\\"cloudflare\\\",\\\"set-cookie\\\":\\\"__cf_bm=JFjVwHkPhLVmM1Sh.Yu565JWG_S40PPdGB_iuG9T3SU-1700083021-0-AZ4pHHR/GqGWYXuQRyoV8DJI5IsGKvQwgkOoncemY83+EbtnkkZVaIva/K8zlEQPV+PbPvpb9dLejrs0jP6SDk0=; path=/; expires=Wed, 15-Nov-23 21:47:01 GMT; domain=.api.openai.com; HttpOnly; Secure; SameSite=None, _cfuvid=g6cSuKDWkXGIaJPHoX7SYKTyrtzPXz1u2rrkGWrhaKw-1700083021960-0-604800000; path=/; domain=.api.openai.com; HttpOnly; Secure; SameSite=None\\\",\\\"strict-transport-security\\\":\\\"max-age=15724800; includeSubDomains\\\",\\\"vary\\\":\\\"Origin\\\",\\\"x-ratelimit-limit-requests\\\":\\\"200\\\",\\\"x-ratelimit-limit-tokens\\\":\\\"40000\\\",\\\"x-ratelimit-remaining-requests\\\":\\\"182\\\",\\\"x-ratelimit-remaining-tokens\\\":\\\"39972\\\",\\\"x-ratelimit-reset-requests\\\":\\\"2h7m1.233s\\\",\\\"x-ratelimit-reset-tokens\\\":\\\"42ms\\\",\\\"x-request-id\\\":\\\"eac039ed876683a4d24f0dcc14c01de7\\\"},\\\"error\\\":{\\\"message\\\":\\\"Rate limit reached for gpt-3.5-turbo in organization org-AUD3g4nNLkQclchMX3idwTv4 on requests per min (RPM): Limit 3, Used 3, Requested 1. Please try again in 20s. Visit https://platform.openai.com/account/rate-limits to learn more. You can increase your rate limit by adding a payment method to your account at https://platform.openai.com/account/billing.\\\",\\\"type\\\":\\\"requests\\\",\\\"param\\\":null,\\\"code\\\":\\\"rate_limit_exceeded\\\"},\\\"code\\\":\\\"rate_limit_exceeded\\\",\\\"param\\\":null,\\\"type\\\":\\\"requests\\\"}\",\"Error: {\\\"status\\\":429,\\\"headers\\\":{\\\"alt-svc\\\":\\\"h3=\\\\\\\":443\\\\\\\"; ma=86400\\\",\\\"cf-cache-status\\\":\\\"DYNAMIC\\\",\\\"cf-ray\\\":\\\"826a84d37a508e4a-TLV\\\",\\\"connection\\\":\\\"keep-alive\\\",\\\"content-length\\\":\\\"493\\\",\\\"content-type\\\":\\\"application/json; charset=utf-8\\\",\\\"date\\\":\\\"Wed, 15 Nov 2023 21:17:04 GMT\\\",\\\"server\\\":\\\"cloudflare\\\",\\\"set-cookie\\\":\\\"__cf_bm=ak3lA8qM2LeOqL05EPcv40ogXpCgYbAoLOt.AQNTECE-1700083024-0-AVwFtsW77Pc+Ezaw1ZmdIDpjaXKUOXfXQ0fHIngfN3Kt3qlLvegXXCWTt/4S94KZVP8rT8Kao5x+a5PRLScX+fk=; path=/; expires=Wed, 15-Nov-23 21:47:04 GMT; domain=.api.openai.com; HttpOnly; Secure; SameSite=None, _cfuvid=0W_nFqGjJOTcujptyIO255qfLKntUsQnA5z7Cr1q36M-1700083024112-0-604800000; path=/; domain=.api.openai.com; HttpOnly; Secure; SameSite=None\\\",\\\"strict-transport-security\\\":\\\"max-age=15724800; includeSubDomains\\\",\\\"vary\\\":\\\"Origin\\\",\\\"x-ratelimit-limit-requests\\\":\\\"200\\\",\\\"x-ratelimit-limit-tokens\\\":\\\"40000\\\",\\\"x-ratelimit-remaining-requests\\\":\\\"176\\\",\\\"x-ratelimit-remaining-tokens\\\":\\\"39972\\\",\\\"x-ratelimit-reset-requests\\\":\\\"2h50m11.065s\\\",\\\"x-ratelimit-reset-tokens\\\":\\\"42ms\\\",\\\"x-request-id\\\":\\\"2e73be71a84c532f9cf623d2acad5e23\\\"},\\\"error\\\":{\\\"message\\\":\\\"Rate limit reached for gpt-3.5-turbo in organization org-AUD3g4nNLkQclchMX3idwTv4 on requests per min (RPM): Limit 3, Used 3, Requested 1. Please try again in 20s. Visit https://platform.openai.com/account/rate-limits to learn more. You can increase your rate limit by adding a payment method to your account at https://platform.openai.com/account/billing.\\\",\\\"type\\\":\\\"requests\\\",\\\"param\\\":null,\\\"code\\\":\\\"rate_limit_exceeded\\\"},\\\"code\\\":\\\"rate_limit_exceeded\\\",\\\"param\\\":null,\\\"type\\\":\\\"requests\\\"}\",\"Error: {\\\"status\\\":429,\\\"headers\\\":{\\\"alt-svc\\\":\\\"h3=\\\\\\\":443\\\\\\\"; ma=86400\\\",\\\"cf-cache-status\\\":\\\"DYNAMIC\\\",\\\"cf-ray\\\":\\\"826a84dffd9c8e4a-TLV\\\",\\\"connection\\\":\\\"keep-alive\\\",\\\"content-length\\\":\\\"493\\\",\\\"content-type\\\":\\\"application/json; charset=utf-8\\\",\\\"date\\\":\\\"Wed, 15 Nov 2023 21:17:06 GMT\\\",\\\"server\\\":\\\"cloudflare\\\",\\\"set-cookie\\\":\\\"__cf_bm=67S0qTghJTmm2rEGF3NgK8rv4zukp3qxt1E7ztpQwT4-1700083026-0-AbTtQgFx0HbkT4eAdUNr2jGFqalOfp0tvhMZjnJN76jlZrKJaeBSz7+dn6N9FpFi7tVLh0lEBf+BJMF/i7GAWCY=; path=/; expires=Wed, 15-Nov-23 21:47:06 GMT; domain=.api.openai.com; HttpOnly; Secure; SameSite=None, _cfuvid=I4kiizDqOMAzqE8KlvziSp074xr3IKex4bihDNmbJQk-1700083026140-0-604800000; path=/; domain=.api.openai.com; HttpOnly; Secure; SameSite=None\\\",\\\"strict-transport-security\\\":\\\"max-age=15724800; includeSubDomains\\\",\\\"vary\\\":\\\"Origin\\\",\\\"x-ratelimit-limit-requests\\\":\\\"200\\\",\\\"x-ratelimit-limit-tokens\\\":\\\"40000\\\",\\\"x-ratelimit-remaining-requests\\\":\\\"170\\\",\\\"x-ratelimit-remaining-tokens\\\":\\\"39973\\\",\\\"x-ratelimit-reset-requests\\\":\\\"3h33m21.04s\\\",\\\"x-ratelimit-reset-tokens\\\":\\\"40ms\\\",\\\"x-request-id\\\":\\\"2c28f579257849c7d970b5c12fdfd183\\\"},\\\"error\\\":{\\\"message\\\":\\\"Rate limit reached for gpt-3.5-turbo in organization org-AUD3g4nNLkQclchMX3idwTv4 on requests per min (RPM): Limit 3, Used 3, Requested 1. Please try again in 20s. Visit https://platform.openai.com/account/rate-limits to learn more. You can increase your rate limit by adding a payment method to your account at https://platform.openai.com/account/billing.\\\",\\\"type\\\":\\\"requests\\\",\\\"param\\\":null,\\\"code\\\":\\\"rate_limit_exceeded\\\"},\\\"code\\\":\\\"rate_limit_exceeded\\\",\\\"param\\\":null,\\\"type\\\":\\\"requests\\\"}\",\"Sorry, but I am not able to generate a response based on the information provided. Could you please provide more context or clarify your request?\"]",
            "visibility": false,
            "_id": "655kjbkjbkbkkb8b4d4313503",
            "createdAt": "2023-11-15T21:17:13.292Z",
            "updatedAt": "2023-11-15T21:17:13.292Z"
        }*/
    /* const rolesX = [ex, ...([


         ...r, ...rolesData?.getmyroles] || [])];*/

    useEffect(() => {
        setPlaceHolderRoles(true)
    }, [])

    const navigate = useNavigate()


    return (
        <>
            <Paper
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: isMobile ? '65vh' : "88vh",
                    justifyContent: 'space-between',
                    overflow: 'scroll',
                }}
            >
                <List
                    sx={{
                        overflowY: 'auto',
                        maxHeight: '80vh',
                        marginBottom: '2em'
                    }}
                >
                    {sessions?.map((session) => (
                        <ListItem
                            key={session._id}
                            onClick={() => setSelectedSession(session._id)}
                            secondaryAction={
                                <>
                                    <IconButton onClick={() => {
                                        setEditingSession(session);
                                        setRenameValue(session.name);
                                    }}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => deleteSessionById && deleteSessionById(session._id)}>
                                        <DeleteForever/>
                                    </IconButton>
                                </>

                            }
                        >
                            <ListItemText primary={session.name}/>
                        </ListItem>
                    ))}
                </List>
            </Paper>
            <Grid container
                  direction={isMobile ? "column" : "row"}
                  rowSpacing={2}
                  justifyContent="space-around"
                  alignItems="center"
                  columnSpacing={editingSession ? 8 : 0}
                  paddingTop="2vh"
                  style={{
                      width: isMobile ? "100vw" : `calc(100vw - ${DRAWER_WIDTH_OPEN}px)`,
                      flexWrap: 'wrap', // Ensure items can wrap
                      overflowX: 'hidden' // Prevent horizontal scrolling
                  }}>
                {editingSession ? (
                    <>
                        <Grid item> {/* Adjust grid item size based on screen size */}
                            <TextField
                                label="Rename Session"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                            />
                        </Grid>
                        <Grid item> {/* Adjust grid item size based on screen size */}
                            <Button
                                onClick={handleRename}
                                disabled={!renameValue.trim()}
                            >
                                Save Changes
                            </Button>
                        </Grid>
                    </>
                ) : (
                    <>
                        <Grid item> {/* Adjust grid item size based on screen size */}
                            <TextField
                                label="New Session Name"
                                value={newSessionName}
                                onChange={(e) => setNewSessionName(e.target.value)}
                            />
                        </Grid>
                        <Grid item> {/* Adjust grid item size based on screen size */}
                            <Select
                                value={placeHolderRoles ? selectedRoleId : (selectedRoleId /*|| rolesX[0]*/)}
                                onChange={(e) => {
                                    setPlaceHolderRoles(false);
                                    setSelectedRoleId(e.target.value)
                                }}>
                                {((/*placeHolderRoles ? rolesX : */[
                                    {
                                        "__typename": "role",
                                        "creatorId": "6549d6374eafc2e10f412993",
                                        "name": "AI Couple Therapist",
                                        "publicName": null,
                                        "role": "You are a professional relationship therapist that specialises in cognitive behavioral couples therapy - behavioral couples therapy that specifically focuses on the reciprocal influence of the partners’ idiosyncratic patterns of ideas about each other and about couples in general. Interfering ideas are made conscious and explicit and are then altered to improve the couple’s relationship using techniques modified from cognitive behavior therapy. After each question, you will be provided with answers from both sides and you will provide unbiased answer as the therapist and add the followup question. your goal is to practically improve their relationship while sometimes provide practical exercises. make your responses short and concise, at the end of each of your responses, provide a follow-up question. After a number of questions and answers, conclude the session and ask the couple if they want to continue for another session. Remember, the goal is to preform a CBCT therapy.",
                                        "setId": "654ec3f21c87de178f3c4a55",
                                        "attributes": null,
                                        "description": "1",
                                        "aiMessage": "[\"Therapist: It's nice to meet both of you, Jake and Sarah. It's clear that you both have different passions and interests, but it's important to find a way to connect and support each other in your individual pursuits. Let's explore how you currently navigate these differences in your relationship. \\n\\nQuestion 1: How do you currently support each other in pursuing your individual interests and passions?\"]",
                                        "visibility": true,
                                        "_id": "654ec6a80e5eb4fc793dc5c9",
                                        "createdAt": "2023-11-11T00:11:20.539Z",
                                        "updatedAt": "2023-11-25T12:45:32.660Z"
                                    }

                                    , ...r, ...rolesData?.getmyroles])?.map((role: any) => (
                                    <MenuItem key={role._id} value={role._id}>
                                        {role.name}
                                    </MenuItem>
                                )))}
                                <MenuItem>
                                    <Button
                                        startIcon={<Shop/>}
                                        onClick={() => navigate("/shop")}
                                    >
                                        Get New Roles
                                    </Button>
                                </MenuItem>
                            </Select>
                        </Grid>
                        <Grid item> {/* Adjust grid item size based on screen size */}
                            <Button
                                variant="contained"
                                startIcon={<AddCircleOutlineIcon/>}
                                onClick={user?.subscription === "free" ? () => navigate("/sub") : handleCreate}
                                disabled={(!newSessionName.trim() || !selectedRoleId || selectedRoleId === "655kjbkjbkbkkb8b4d4313503")}
                            >
                                Add Session
                            </Button>
                        </Grid>
                    </>
                )}
            </Grid>
        </>
    );
};


const SessionsPage = () => {
    const {isMobile} = useMobile();


    const {contacts, contactsIds} = useContext(ContactsContext);
    const {pairId, setPairId} = useContext(ChatContext);

    const [placeHolderContacts, setPlaceHolderContacts] = useState<boolean>(true);
    const contactsX = [{name: "📞 Select a Contact"}, ...((contacts || []))];


    return pairId ? <SessionsManager/> :
        <Grid container direction="column" justifyContent="center" alignItems="center" height="100vh">
            <Grid item>
                <Typography variant={isMobile ? "h6" : "h4"} textAlign="center" color="gray">
                    Choose a contact before managing sessions:
                </Typography>
            </Grid>
            <Grid item container justifyContent="center" alignItems="center">
                <Grid item>
                    <Select
                        fullWidth
                        value={contacts[contactsIds.findIndex((id: any) => id === pairId)] || contactsX[0]}
                        onChange={(e) => {
                            setPlaceHolderContacts(false);
                            setPairId(contactsIds[contacts.findIndex(number => number === e.target.value)]);
                        }}
                        sx={{margin: '1em 0', marginLeft: "5%", width: "50vw", maxWidth: "300px"}}
                    >
                        {(placeHolderContacts ? contactsX : contacts)?.map((contact: any, index) => (
                            <MenuItem key={index} value={contact}>{contact.name || contact.phone}</MenuItem>
                        ))}
                        <Divider/>
                    </Select>
                </Grid>
            </Grid>
        </Grid>;
};

export default SessionsPage;
