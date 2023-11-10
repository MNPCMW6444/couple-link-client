import {useState} from 'react';
import {useQuery, useMutation, gql} from '@apollo/client';
import {
    Grid,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    CircularProgress
} from "@mui/material";
import useMobile from "../../hooks/responsiveness/useMobile.ts";

const GET_MY_ROLES = gql`
  query Getmyroles {
    getmyroles {
      creatorId
      role
      messageOneExample
      messageTwoExample
      category
      description
      visibility
      _id
      aiMessage
      createdAt
      updatedAt
    }
  }
`;

const ADD_ROLE = gql`
  mutation Addrole($role: String!, $category: String!, $description: String!, $messageOneExample: String, $messageTwoExample: String) {
    addrole(role: $role, category: $category, description: $description, messageOneExample: $messageOneExample, messageTwoExample: $messageTwoExample)
  }
`;

const PUBLISH_ROLE = gql`
  mutation Publishrole($roleId: String!) {
    publishrole(roleId: $roleId)
  }
`;

const RND = () => {
    const {isMobile} = useMobile();
    const {loading, error, data, refetch} = useQuery(GET_MY_ROLES);
    const [addRole] = useMutation(ADD_ROLE, {
        refetchQueries: [GET_MY_ROLES],
    });
    const [publishRole] = useMutation(PUBLISH_ROLE);
    const [newRole, setNewRole] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [messageOneExample, setMessageOneExample] = useState('');
    const [messageTwoExample, setMessageTwoExample] = useState('');
    const [mutating, setMutating] = useState(false);

    const handleAddRole = () => {
        setMutating(true);
        addRole({
            variables: {
                role: newRole,
                category,
                description,
                messageOneExample,
                messageTwoExample
            }
        }).then(() => {
            refetch();
            setMutating(false);
        });
        setNewRole('');
        setCategory('');
        setDescription('');
        setMessageOneExample('');
        setMessageTwoExample('');
    };

    const handlePublishRole = (roleId: string) => {
        publishRole({variables: {roleId}});
    };

    if (loading) return <CircularProgress/>;
    if (error) return <p>Error :(</p>;

    return (
        <Grid container direction="column" padding="5%">
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
            <TextField
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Message One Example"
                value={messageOneExample}
                onChange={(e) => setMessageOneExample(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Message Two Example"
                value={messageTwoExample}
                onChange={(e) => setMessageTwoExample(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button disabled={mutating} variant="contained" color="primary" onClick={handleAddRole}>
                Add Role
            </Button>
            <List>
                {data.getmyroles.map(({
                                          _id,
                                          role,
                                          category,
                                          description,
                                          aiMessage,
                                          messageOneExample,
                                          messageTwoExample
                                      }: any) => (
                    <ListItem key={_id}>
                        <ListItemText
                            primary={`${role} (${category})`}
                            secondary={`Description: ${description}, Examples: ${messageOneExample}, ${messageTwoExample}
                            
                            Result:
                            ${aiMessage}`}
                        />
                        <Button onClick={() => handlePublishRole(_id)}>Publish</Button>
                    </ListItem>
                ))}
            </List>
        </Grid>
    );
};

export default RND;
