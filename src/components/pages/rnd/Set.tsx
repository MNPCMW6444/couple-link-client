import {useState, useEffect, useRef, useContext} from 'react';
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
import RNDContext from "../../../context/RNDContext.tsx";

const Set = () => {
    const {isMobile} = useMobile();

    const [newSet, setNewSet] = useState('');
    const [side1, setSide1] = useState('');
    const [side2, setSide2] = useState('');
    const [pairs, setPairs] = useState<any>([]);
    const [mutating, setMutating] = useState(false);

    const side1Ref = useRef<any>(null);
    const side2Ref = useRef<any>(null);

    const {loadingsets, errorsets, datasets, refetchsets, addSet, publishSet} = useContext(RNDContext);

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
            refetchsets();
            setMutating(false);
            setNewSet('');
            setPairs([]);
        });
    };

    const handlePublishSet = (setId: string) => {
        publishSet({variables: {setId}});
    };

    if (loadingsets) return <CircularProgress/>;
    if (errorsets) return <p>Error :(</p>;

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
                    <Button disabled={mutating || !!side1 || !!side2} variant="contained" color="primary"
                            onClick={handleAddSet} fullWidth>
                        Add Set
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <List>
                    {datasets && datasets.getmysets.map(({_id, name, stringifiedArray}: any) => (
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
