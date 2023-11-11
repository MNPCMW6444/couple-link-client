import {useState} from 'react';
import {useQuery, useMutation, gql} from '@apollo/client';
import {
    Grid,
    Typography,
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";
import useMobile from "../../../hooks/responsiveness/useMobile.ts";
import Role from "./Role.tsx";
import Set from "./Set.tsx";

const GET_MY_ROLES = gql`
  query Getmyroles {
      getmyroles {
        creatorId
        role
        setId
        category
        description
        aiMessage
        visibility
        _id
        createdAt
        updatedAt
      }
 }
`;

const ADD_ROLE = gql`
    mutation Addrole($role: String!, $category: String!, $description: String!, $name: String) {
      addrole(role: $role, category: $category, description: $description, name: $name)
    }
`;


const RND = () => {
    const {isMobile} = useMobile();
    const {loading, error, data, refetch} = useQuery(GET_MY_ROLES);
    const [addRole] = useMutation(ADD_ROLE, {
        refetchQueries: [GET_MY_ROLES],
    });
    const [newRole, setNewRole] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [mutating, setMutating] = useState(false);

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
            <>
                <Grid container spacing={2} padding={2}>
                    <Grid item xs={12}>
                        <Typography variant={isMobile ? "h3" : "h1"} align="center">
                            Roles
                        </Typography>
                    </Grid>
                    <Grid item xs={12} container direction="column" rowSpacing={2}>
                        <Grid item>
                            <TextField label="The Role Prompt" value={newRole}
                                       onChange={(e) => setNewRole(e.target.value)}
                                       fullWidth/>
                        </Grid>
                        <Grid item>
                            <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)}
                                       fullWidth/>
                        </Grid>
                        <Grid item>
                            <TextField label="Description" value={description}
                                       onChange={(e) => setDescription(e.target.value)}
                                       fullWidth/>
                        </Grid>
                        <Grid item>
                            <TextField label="Set Name - copy exact name" value={name}
                                       onChange={(e) => setName(e.target.value)} fullWidth/>
                        </Grid>
                        <Grid item>
                            <Button disabled={mutating} variant="contained" color="primary" onClick={handleAddRole}
                                    fullWidth>
                                Add Role
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container direction="column" rowSpacing={2}>
                        {data.getmyroles.map((role: any) => <Grid item><Role key={role._id} rolex={role}/></Grid>)}
                    </Grid>
                </Grid>
            </>
        </>
    );
};

export default RND;
