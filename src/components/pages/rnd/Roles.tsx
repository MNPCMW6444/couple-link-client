import {useState, useEffect, useRef, useContext} from 'react';
import {Grid, Typography, TextField, Button, CircularProgress, Select, MenuItem, IconButton} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import useMobile from "../../../hooks/responsiveness/useMobile";
import Role from "./Role";
import RNDContext from "../../../context/RNDContext";

const Roles = () => {
    const {isMobile} = useMobile();
    const [newRole, setNewRole] = useState('');
    const [setName, setSetName] = useState('');
    const [attributes, setAttributes] = useState({});
    const [newAttributeKey, setNewAttributeKey] = useState('');
    const [newAttributeValue, setNewAttributeValue] = useState('');
    const [description, setDescription] = useState('');
    const [roleName, setRoleName] = useState('');
    const [publicName, setPublicName] = useState('');
    const [mutating, setMutating] = useState(false);

    const roleRef = useRef<any>(null);

    useEffect(() => {
        if (roleRef.current) {
            roleRef.current.style.height = 'auto';
            roleRef.current.style.height = `${roleRef.current.scrollHeight}px`;
        }
    }, [setName]);

    const {loading, loadingsets, error, errorsets, data, datasets, refetch, addRole} = useContext(RNDContext);

    const handleAddRole = () => {
        setMutating(true);
        addRole({
            variables: {
                role: newRole,
                roleName,
                publicName,
                attributes,
                description,
                setName
            }
        }).then(() => {
            refetch();
            setMutating(false);
        });
        setNewRole('');
        setAttributes({});
        setDescription('');
        setRoleName('');
        setPublicName('');
        setSetName('');
    };

    const handleAddAttribute = () => {
        if (newAttributeKey && newAttributeValue) {
            setAttributes(prev => ({...prev, [newAttributeKey]: newAttributeValue}));
            setNewAttributeKey('');
            setNewAttributeValue('');
        }
    };

    if (loading) return <CircularProgress/>;
    if (loadingsets) return <CircularProgress/>;
    if (error) return <p>Error :(</p>;
    if (errorsets) return <p>Error :(</p>;

    return (
        <>
            <Grid container spacing={2} padding={2}>
                <Grid item xs={12}>
                    <Typography variant={isMobile ? "h3" : "h1"} align="center">
                        Roles
                    </Typography>
                </Grid>
                <Grid item xs={12} container direction="column" rowSpacing={2}>
                    <Grid item>
                        <TextField label="Name" value={roleName} onChange={(e) => setRoleName(e.target.value)}
                                   fullWidth/>
                    </Grid>
                    <Grid item>
                        <TextField label="Public Name" value={publicName}
                                   onChange={(e) => setPublicName(e.target.value)} fullWidth/>
                    </Grid>
                    <Grid item>
                        <TextField inputRef={roleRef} multiline label="The Role Prompt" value={newRole}
                                   onChange={(e) => setNewRole(e.target.value)} fullWidth/>
                    </Grid>
                    <Grid item>
                        <Select value={setName} onChange={(e) => setSetName(e.target.value)}
                                sx={{width: '100%', margin: '1em 0'}}>
                            {datasets && datasets.getmysets.map(({name}: any) => (
                                <MenuItem key={name} value={name}>{name}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item>
                        <TextField label="Attribute Key" value={newAttributeKey}
                                   onChange={(e) => setNewAttributeKey(e.target.value)} fullWidth/>
                        <TextField label="Attribute Value" value={newAttributeValue}
                                   onChange={(e) => setNewAttributeValue(e.target.value)} fullWidth/>
                        <IconButton onClick={handleAddAttribute}><AddCircleOutlineIcon/></IconButton>
                    </Grid>
                    <Grid item>
                        <TextField label="Description" value={description}
                                   onChange={(e) => setDescription(e.target.value)} fullWidth/>
                    </Grid>
                    <Grid item>
                        <Button disabled={mutating || !(newRole && roleName && description && setName)}
                                variant="contained" color="primary" onClick={handleAddRole} fullWidth>
                            Add Role
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12} container direction="column" rowSpacing={2}>
                    {data?.getmyroles?.map((role: any) => (
                        <Grid item key={role._id}><Role rolex={role}/></Grid>
                    ))}
                </Grid>
            </Grid>
        </>
    );
};

export default Roles;
