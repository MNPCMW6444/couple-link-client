import {FC, useContext, useState} from "react";
import {Container, Typography, Paper, Switch, FormControlLabel, Button, Grid} from "@mui/material";
import styled from "@emotion/styled";
import {gql, useMutation} from "@apollo/client";
import UserContext from "../../../context/UserContext.tsx";
import {useNavigate} from "react-router-dom";


const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 32px;
  min-height: 100vh;
`;

const StyledPaper = styled(Paper)`
  padding: 16px;
  width: 100%;
  max-width: 600px;
`;

const UPDATE_RND_MUTATION = gql`
  mutation UpdateRND($rnd: String!) {
    updateRND(rnd: $rnd)
  }
`;

const NotificationsTab: FC = () => {
    const {user, refreshUserData} = useContext(UserContext);
    const [rnd, setRnd] = useState(user.rnd);
    const [updateRND, {loading}] = useMutation(UPDATE_RND_MUTATION, {
        variables: {rnd: !rnd ? "true" : "false"},
        onCompleted: () => {
            refreshUserData();
        },
        onError: () => {
            refreshUserData();
        },
    });

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRnd(event.target.checked);
        updateRND();
    };

    const navigate = useNavigate();

    return (
        <StyledContainer maxWidth="xs">
            <Typography variant="h4" gutterBottom>
                Account Settings
            </Typography>
            <StyledPaper>
                <Grid container wrap="nowrap" direction="column" spacing={2}>
                    <Grid item>
                        <Typography variant="h6" gutterBottom component="div"
                                    sx={{fontSize: "90%"}}>
                            <strong>Phone Number:</strong> +{user.phone}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" gutterBottom component="div"
                                    sx={{fontSize: "90%"}}>
                            <strong>Email Address:</strong> {user.email}
                        </Typography>
                    </Grid>
                    <Grid item container wrap="nowrap" alignItems="center" spacing={3}>
                        <Grid item xs={12} sm={5}>
                            <Typography variant="h6" gutterBottom component="div"
                                        sx={{fontSize: "90%"}}>
                                <strong>Subscription Status:</strong>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Typography variant="body1" gutterBottom
                                        sx={{fontSize: "90%"}}>
                                {user.subscription === "free" ? "Inactive" : "Active"}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Button sx={{fontSize: "60%"}} variant="contained" onClick={() => navigate("/sub")}>
                                Manage Subscription
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item container wrap="nowrap" alignItems="center" spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{fontSize: "90%"}}
                                        variant="h6" gutterBottom
                                        component="div">
                                <strong>R&D Mode:</strong>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={rnd}
                                        onChange={handleSwitchChange}
                                        disabled={loading}
                                    />
                                }
                                label={<Typography
                                    sx={{fontSize: "90%"}}
                                    variant="body1">Enable R&D
                                    Mode</Typography>}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </StyledPaper>
        </StyledContainer>
    );
};

export default NotificationsTab;
