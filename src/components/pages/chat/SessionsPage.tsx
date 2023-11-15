import {useState, useContext} from 'react';
import {
    Box,
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    Select,
    MenuItem
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import {gql, useMutation} from "@apollo/client";
import ChatContext from "../../../context/ChatContext";
import RNDContext from "../../../context/RNDContext.tsx";


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
        setSelectedSession
    } = useContext(ChatContext);

    const [newSessionName, setNewSessionName] = useState('');
    const [editingSession, setEditingSession] = useState<Session | null>(null);
    const [renameValue, setRenameValue] = useState('');

    const [renameSession] = useMutation(RENAME_SESSION_MUTATION, {});

    const [selectedRoleId, setSelectedRoleId] = useState('');


    const handleCreate = async () => {
        await createSession(pairId, newSessionName, selectedRoleId);
        setNewSessionName('');
        setSelectedRoleId(''); // Reset selected role ID
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


    const {data: rolesData} = useContext(RNDContext);


    return (
        <Box>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2}}>
                <TextField
                    label="New Session Name"
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                />
                <Select value={selectedRoleId} onChange={(e) => setSelectedRoleId(e.target.value)}>
                    {rolesData.getmyroles.map((role: any) => (
                        <MenuItem key={role._id} value={role._id}>
                            {role.name}
                        </MenuItem>
                    ))}
                </Select>
                <Button
                    startIcon={<AddCircleOutlineIcon/>}
                    onClick={handleCreate}
                    disabled={!newSessionName.trim()}
                >
                    Add Session
                </Button>
            </Box>
            {editingSession && (
                <Box sx={{display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2}}>
                    <TextField
                        label="Rename Session"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                    />
                    <Button
                        onClick={handleRename}
                        disabled={!renameValue.trim()}
                    >
                        Save Changes
                    </Button>
                </Box>
            )}
            <List>
                {sessions?.map((session) => (
                    <ListItem
                        key={session._id}
                        onClick={() => setSelectedSession(session._id)}
                        secondaryAction={
                            <IconButton edge="end" aria-label="edit" onClick={() => {
                                setEditingSession(session);
                                setRenameValue(session.name);
                            }}>
                                <EditIcon/>
                            </IconButton>
                        }
                    >
                        <ListItemText primary={session.name}/>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

const SessionsPage = () => {
    const {pairId} = useContext(ChatContext);

    return pairId ? <SessionsManager/> :
        <Typography variant="h3">Use the sidebar to choose a contact before managing sessions.</Typography>;
};

export default SessionsPage;
