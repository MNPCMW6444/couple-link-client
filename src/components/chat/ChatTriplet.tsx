import {Grid} from "@mui/material";


interface ChatTripletProps {
    triplet: string[];
}

const ChatTriplet = (({triplet}: ChatTripletProps) => {
    return <Grid>
        <Grid item>
        </Grid>
        <Grid item></Grid>
        <Grid item></Grid>
        {triplet}
    </Grid>
});

export default ChatTriplet