import {useContext} from "react";
import UserContext from "../../context/UserContext.tsx";
import {Grid, Typography} from "@mui/material";
import useMobile from "../../hooks/responsiveness/useMobile.ts";

const RND = () => {
    const {user} = useContext(UserContext);
    const {isMobile} = useMobile();

    return (user.phone === "972527820055" || user.phone === "972528971871") &&

        <Grid container direction="column" padding="5%">
            <Typography variant={isMobile ? "h3" : "h1"} align="center" gutterBottom>
                Roles
            </Typography> </Grid>

}

export default RND