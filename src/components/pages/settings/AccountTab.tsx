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
            refreshUserData()
        },
        onError: () => {
            refreshUserData()
        },
    });

    // Handle switch change
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
                <Grid container direction="column" rowSpacing={2}>
                    <Grid item>
                        <Typography variant="h6" gutterBottom>
                            Phone Number: +{user.phone}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" gutterBottom>
                            Email Address: {user.email}
                        </Typography>
                    </Grid>
                    <Grid item container alignItems="center" columnSpacing={2}>
                        <Grid item>
                            <Typography variant="h6" gutterBottom>
                                Subscription Status: {user.subscription === "free" ? "Inactive" : "Active"}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained" onClick={() => navigate("/sub")}>
                                Subscribe
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={rnd}
                                    onChange={handleSwitchChange}
                                    disabled={loading}
                                />
                            }
                            label="I want to develop and sell Roles"
                        />
                    </Grid>
                </Grid>
            </StyledPaper>
        </StyledContainer>
    );
};

export default NotificationsTab;
