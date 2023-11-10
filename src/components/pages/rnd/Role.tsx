import {gql, useMutation, useQuery} from "@apollo/client";
import {Button, Grid, Paper, Typography} from "@mui/material";


const GET_SET_NAME = gql`
  query Query($getsetnameId: String!) {
    getsetname(id: $getsetnameId)
}
`;

const PUBLISH_ROLE = gql`
  mutation Publishrole($roleId: String!) {
    publishrole(roleId: $roleId)
  }
`;


const Role = ({rolex}: any) => {
    const {_id, role, category, description, setId, aiMessage} = rolex;
    const [publishRole] = useMutation(PUBLISH_ROLE);

    const {data} = useQuery(GET_SET_NAME, {variables: {getsetnameId: setId}});

    const handlePublishRole = (roleId: string) => {
        publishRole({variables: {roleId}});
    };


    return <Paper elevation={3} sx={{padding: 2}}>
        <Grid container direction="column">
            <Grid item>
                <Typography sx={{fontWeight: 800}}>Category:</Typography>
            </Grid>
            <Grid item>
                <Typography>{category}</Typography>
            </Grid>
            <br/>
            <Grid item>
                <Typography sx={{fontWeight: 800}}>Description:</Typography>
            </Grid>
            <Grid item>
                <Typography>{description}</Typography>
            </Grid>
            <br/>
            <Grid item>
                <Typography sx={{fontWeight: 800}}>The role prompt:</Typography>
            </Grid>
            <Grid item>
                <Typography>{role}</Typography>
            </Grid>
            <br/>
            <Grid item>
                <Typography sx={{fontWeight: 800}}>Set Name Used For test:</Typography>
            </Grid>
            <Grid item>
                <Typography>{data?.getsetname || "ERRORORORORORORORO"}</Typography>
            </Grid>
            <br/>
            <Grid item>
                <Typography sx={{fontWeight: 800}}>Result:</Typography>
            </Grid>
            <Grid item>
                <Typography>{aiMessage}</Typography>
            </Grid>
            <br/>
            <Grid item>
                <Button onClick={() => handlePublishRole(_id)}>Publish</Button>
            </Grid>
        </Grid>
    </Paper>
}

export default Role