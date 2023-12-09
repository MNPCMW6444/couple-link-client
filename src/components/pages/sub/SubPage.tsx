import {Button, Grid, Link, TextField, Typography} from "@mui/material";
import {useContext, useState} from "react";
import UserContext from "../../../context/UserContext.tsx";
import {gql, useMutation} from "@apollo/client";


const TRY_TO_ACTIVATE = gql`
    mutation TryToActivate($email: String!) {
      tryToActivate(email: $email)
    }
`

const SubPage = () => {

    const {user, refreshUserData} = useContext(UserContext)

    const [email, setEmail] = useState("")
    const [res, setRes] = useState("")

    const [tryToActivate] = useMutation(TRY_TO_ACTIVATE, {})

    const handleButton = () => {
        tryToActivate({variables: {email}}).then(
            () => {
                setRes("Success, you can how create a Session")
                refreshUserData()
            }
        )
            .catch(
                (resError) => {
                    setRes(resError?.message)
                }
            )
    }


    return (
        <Grid container direction="column" alignItems="center" rowSpacing={4}>
            <Grid item>
                <Typography variant="h4">Subscription</Typography>
            </Grid>
            <Grid item>
                <Typography variant="h6" color={user.subscription === "free" ? "red" : "green"}>Subscription
                    Status: {user.subscription === "free" ? "Inactive" : "Active"}
                </Typography>
            </Grid>
            {
                user.subscription === "free" &&
                <>
                    <Grid item>
                        <Typography variant="h6">To subscribe, visit this Link:</Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained">
                            <Link sx={{color: "unset"}}
                                  href="https://buy.stripe.com/14k3dI0NogAYdGg8ww">Subscribe</Link>
                        </Button>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">and tham enter your email used to subscribe here:</Typography>
                    </Grid>
                    <Grid item>
                        <TextField sx={{width: 300}} value={email}
                                   onChange={(e) => setEmail(e.target.value)}></TextField>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={handleButton}>Activate Subscription</Button>
                    </Grid>
                    {res && <Grid item>
                        <Typography variant="h6">{res}</Typography>
                    </Grid>}
                </>
            }
        </Grid>
    );
}

export default SubPage;