import {useState, useEffect, useRef, useContext} from 'react';
import {
    Grid,
    Typography,
    TextField,
    Button,
    CircularProgress, MenuItem, Select,
} from "@mui/material";
import useMobile from "../../../hooks/responsiveness/useMobile";
import Role from "./Role";
import Set from "./Set";
import RNDContext from "../../../context/RNDContext.tsx";


const RND = () => {
    const {isMobile} = useMobile();

    const [newRole, setNewRole] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [mutating, setMutating] = useState(false);

    const roleRef = useRef<any>(null);

    useEffect(() => {
        if (roleRef.current) {
            roleRef.current.style.height = 'auto';
            roleRef.current.style.height = `${roleRef.current.scrollHeight}px`;
        }
    }, [newRole]);

    const {loading, error, data, datasets, refetch, addRole} = useContext(RNDContext)

    const handleAddRole = () => {
        setMutating(true);
        addRole({
            variables: {
                role: newRole,
                category,
                description,
                name
            }
        }).then(() => {
            refetch();
            setMutating(false);
        });
        setNewRole('');
        setCategory('');
        setDescription('');
        setName('');
    };

    if (loading) return <CircularProgress/>;
    if (error) return <p>Error :(</p>;

    return (
        <>
            <Set/>
            <Grid container spacing={2} padding={2}>
                <Grid item xs={12}>
                    <Typography variant={isMobile ? "h3" : "h1"} align="center">
                        Roles
                    </Typography>
                </Grid>
                <Grid item xs={12} container direction="column" rowSpacing={2}>
                    <Grid item>
                        <TextField inputRef={roleRef} multiline label="The Role Prompt" value={newRole}
                                   onChange={(e) => setNewRole(e.target.value)} fullWidth/>
                    </Grid>
                    <Grid item>
                        <TextField label="Category" value={category}
                                   onChange={(e) => setCategory(e.target.value)} fullWidth/>
                    </Grid>
                    <Grid item>
                        <TextField label="Description" value={description}
                                   onChange={(e) => setDescription(e.target.value)} fullWidth/>
                    </Grid>
                    <Grid item>
                        <Select
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{width: '100%', margin: '1em 0'}}
                        >
                            {datasets && datasets.getmysets.map(({name}: any) => (
                                <MenuItem key={name} value={name}>{name}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item>
                        <Button disabled={mutating} variant="contained" color="primary" onClick={handleAddRole}
                                fullWidth>
                            Add Role
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12} container direction="column" rowSpacing={2}>
                    {data?.getmyroles?.map((role: any) => <Grid item key={role._id}><Role rolex={role}/></Grid>)}
                </Grid>
            </Grid>
        </>
    );
};

export default RND;
