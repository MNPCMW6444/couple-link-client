import {FC, useEffect, useState, useContext} from "react";
import {
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    TextField
} from "@mui/material";
import styled from "@emotion/styled";
import UserContext from "../../../context/UserContext.tsx";
import {NotificationAdd, Delete} from "@mui/icons-material";
import {gql, useMutation, useQuery} from "@apollo/client";
import {UAParser} from 'ua-parser-js';


const GET_PUSHES = gql`
  query Getpushes {
    getpushes {
      userId
      deviceName
      _id
      createdAt
      updatedAt
    }
  }
`;

const SUBSCRIBE_TO_PUSH = gql`
  mutation SubscribeToPush($subscription: JSON!, $deviceName: String!) {
    subscribeToPush(subscription: $subscription, deviceName: $deviceName)
  }
`;

const DELETE_PUSH = gql`
  mutation Deletepush($pushName: String) {
    deletepush(pushName: $pushName)
  }
`;

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

const NotificationsTab: FC = () => {
    const {refreshUserData} = useContext(UserContext);
    const {data: pushesData, refetch} = useQuery(GET_PUSHES);
    const [subscribeToPush] = useMutation(SUBSCRIBE_TO_PUSH);
    const [deletePush] = useMutation(DELETE_PUSH);

    const parser = new UAParser();

    const x = parser.getResult()
    const xx = `${x.browser.name} on ${x.device.model}`;

    const [deviceName, setDeviceName] = useState(xx);

    useEffect(() => {
        refreshUserData();
    }, [refreshUserData]);

    useEffect(() => {
        if (pushesData?.getpushes?.length && pushesData.getpushes.some(({deviceName}: any) => deviceName === deviceName)) {
            debugger;
            setDeviceName(`${deviceName} (2)`)
        } else {
            debugger;
        }
    }, [pushesData]);

    const handleDeleteClick = (pushName: string) => {
        deletePush({variables: {pushName}}).then(() => {
            refetch()
        });
    };

    const handleSubscribeClick = () => {
        const urlBase64ToUint8Array = (base64String: string) => {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);
            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }

        navigator.serviceWorker.ready.then((registration) => {
            registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('BOX9mgkzgqKdn0j6vi-86nqWXoo24Ir4NAPwLe3M-lHgZpBLT153asOtuX1ocALmL3aRzBWgoRhjDAC80-llb6g')
            })
                .then((subscription) => {
                    const graphqlSubscription = {
                        endpoint: subscription.endpoint,
                        keys: {
                            p256dh: subscription?.toJSON()?.keys?.p256dh,
                            auth: subscription?.toJSON()?.keys?.auth,
                        },
                    };
                    subscribeToPush({
                        variables: {
                            subscription: graphqlSubscription,
                            deviceName: deviceName
                        }
                    }).then(() => refetch());
                })
                .catch((error) => {
                    console.error('Error during getSubscription()', error);
                });
        });
    };

    return (
        <StyledContainer maxWidth="xs">
            <Typography variant="h4" gutterBottom>
                Notifications Settings
            </Typography>
            <Typography gutterBottom>
                Below you can see your devices that are currently subscribed to notifications:
            </Typography>
            <StyledPaper elevation={3}>
                <List>
                    {pushesData?.getpushes.map((push: any) => (
                        <ListItem key={push._id}>
                            <ListItemText primary={push.deviceName}
                                          secondary={new Date(push.createdAt).toLocaleString()}/>
                            <IconButton edge="end" aria-label="delete"
                                        onClick={() => handleDeleteClick(push.deviceName)}>
                                <Delete/>
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
                <TextField
                    label="Device Name"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    margin="normal"
                    fullWidth
                />
                <Grid container direction="column" spacing={2} padding={2}>
                    <Grid item alignSelf="center">
                        <Button variant="contained" color="primary" onClick={handleSubscribeClick}>
                            <NotificationAdd sx={{marginRight: 2}}/>
                            Enable Notification
                        </Button>
                    </Grid>
                </Grid>
            </StyledPaper>
        </StyledContainer>
    );
};

export default NotificationsTab;
