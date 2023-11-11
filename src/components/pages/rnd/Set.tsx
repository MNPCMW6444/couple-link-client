import {useState, useEffect, useRef} from 'react';
import {useQuery, useMutation, gql} from '@apollo/client';
import {
    Grid,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Box,
    Divider
} from "@mui/material";
import useMobile from "../../../hooks/responsiveness/useMobile";

const GET_MY_SETS = gql`
  query GetMySets {
    getmysets {
      creatorId
      name
      stringifiedArray
      visibility
      _id
      createdAt
      updatedAt
    }
  }
`;

const ADD_SET = gql`
  mutation AddSet($name: String!, $stringifiedArray: String!) {
    addset(name: $name, stringifiedArray: $stringifiedArray)
  }
`;

const PUBLISH_SET = gql`
  mutation PublishSet($setId: String!) {
    publishset(setId: $setId)
  }
`;

const Set = () => {
    const {isMobile} = useMobile();
    const {loading, error, data, refetch} = useQuery(GET_MY_SETS);
    const [addSet] = useMutation(ADD_SET, {refetchQueries: [GET_MY_SETS]});
    const [publishSet] = useMutation(PUBLISH_SET);
    const [newSet, setNewSet] = useState('');
    const [side1, setSide1] = useState('');
    const [side2, setSide2] = useState('');
    const [pairs, setPairs] = useState<any>([]);
    const [mutating, setMutating] = useState(false);

    const side1Ref = useRef<any>(null);
    const side2Ref = useRef<any>(null);

    useEffect(() => {
        [side1Ref, side2Ref].forEach(ref => {
            if (ref.current) {
                ref.current.style.height = 'auto';
                ref.current.style.height = `${ref.current.scrollHeight}px`;
            }
        });
    }, [side1, side2]);

    const handleAddPair = () => {
        setPairs([...pairs, {side1, side2}]);
        setSide1('');
        setSide2('');
    };

    const handleAddSet = () => {
        setMutating(true);
        addSet({
            variables: {
                name: newSet,
                stringifiedArray: JSON.stringify(pairs)
            }
        }).then(() => {
            refetch();
            setMutating(false);
            setNewSet('');
            setPairs([]);
        });
    };

    const handlePublishSet = (setId: string) => {
        publishSet({variables: {setId}});
    };

    if (loading) return <CircularProgress/>;
    if (error) return <p>Error :(</p>;

    return (
        <Grid container spacing={2} padding={2}>
            <Grid item xs={12}>
                <Typography variant={isMobile ? "h3" : "h1"} align="center">
                    Sets
                </Typography>
            </Grid>
            <Grid item xs={12} container direction="column" rowSpacing={2}>
                <Grid item>
                    <TextField label="New Set" value={newSet} onChange={(e) => setNewSet(e.target.value)} fullWidth/>
                </Grid>
                <Grid item>
                    <TextField inputRef={side1Ref} multiline label="Side 1" value={side1}
                               onChange={(e) => setSide1(e.target.value)} fullWidth/>
                </Grid>
                <Grid item>
                    <TextField inputRef={side2Ref} multiline label="Side 2" value={side2}
                               onChange={(e) => setSide2(e.target.value)} fullWidth/>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="secondary" onClick={handleAddPair} fullWidth>
                        Add Pair
                    </Button>
                </Grid>
                <Grid item>
                    <Button disabled={mutating} variant="contained" color="primary" onClick={handleAddSet} fullWidth>
                        Add Set
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <List>
                    {data && data.getmysets.map(({_id, name, stringifiedArray}: any) => (
                        <Box key={_id} my={2}>
                            <ListItem>
                                <ListItemText primary={name}/>
                            </ListItem>
                            <Divider/>
                            {JSON.parse(stringifiedArray).map((pair: any, index: number) => (
                                <ListItem key={index}>
                                    <ListItemText secondary={`Side 1: ${pair.side1}, Side 2: ${pair.side2}`}/>
                                </ListItem>
                            ))}
                            <Button onClick={() => handlePublishSet(_id)}>Publish</Button>
                        </Box>
                    ))}
                </List>
            </Grid>
        </Grid>
    );
};

export default Set;
