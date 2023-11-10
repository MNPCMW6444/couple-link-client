import {useState} from 'react';
import {useQuery, useMutation, gql} from '@apollo/client';
import {Grid, Typography, TextField, Button, List, ListItem, ListItemText, CircularProgress} from "@mui/material";
import useMobile from "../../hooks/responsiveness/useMobile.ts";

const GET_ROLES = gql`
  query Getroles {
    getroles {
      role
      example
      _id
      createdAt
      updatedAt
    }
  }
`;

const ADD_ROLE = gql`
  mutation Addrole($role: String!) {
    addrole(role: $role)
  }
`;

const RND = () => {
    const {isMobile} = useMobile();
    const {loading, error, data, refetch} = useQuery(GET_ROLES);
    const [addRole] = useMutation(ADD_ROLE, {
        refetchQueries: [GET_ROLES],
    });
    const [newRole, setNewRole] = useState('');
    const [mutating, smutating] = useState(false);

    const handleAddRole = () => {
        smutating(true)
        addRole({variables: {role: newRole}}).then(() => {
            refetch()
            smutating(false)

        })
        setNewRole('');
    };

    if (loading) return <CircularProgress/>;
    if (error) return <p>Error :(</p>;

    return <Grid container direction="column" padding="5%">
        <Typography variant={isMobile ? "h3" : "h1"} align="center" gutterBottom>
            Roles
        </Typography>
        <TextField
            label="New Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            fullWidth
            margin="normal"
        />
        <Button disabled={mutating} variant="contained" color="primary" onClick={handleAddRole}>
            Add Role
        </Button>
        <List>
            {data.getroles.map(({role, example, _id}: any) => (
                <ListItem key={_id}>
                    <ListItemText primary={role} secondary={example}/>
                </ListItem>
            ))}
        </List>
    </Grid>

};

export default RND;
