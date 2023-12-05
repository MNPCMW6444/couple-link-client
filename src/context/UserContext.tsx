import {
    ReactNode,
    createContext,
} from "react";

import {Typography, Grid} from "@mui/material";
import {styled} from "@mui/system";
import {gql, useMutation, useQuery} from "@apollo/client";

export const WhiteTypography = styled(Typography)(({theme}) => ({
    fontWeight: "bold",
    fontSize: 22,
    letterSpacing: 2,
    color: theme.palette.primary,
    marginBottom: theme.spacing(1),
}));

const GET_ME = gql`
    query Getme {
      getme {
        _id
        phone
        rnd
        subscription
    }
}`

const GET_INVENTORY = gql`
    query GeyMyInventory {
      geyMyInventory {
        creatorId
        name
        publicName
        role
        setId
        attributes
        description
        aiMessage
        visibility
        _id
        createdAt
        updatedAt
      }
    }`

const SIGNOUT = gql`
        mutation Mutation {
          signout
        }
    `

const loadingMessage = (
    <Grid height="100vh" width="100vw" container justifyContent="center" alignItems="center">
        <Grid item>
            <WhiteTypography>
                Checkin if you are signed in...
            </WhiteTypography>
        </Grid>
    </Grid>
);

const UserContext = createContext<{
    user?: any;
    myRoles: any[];
    refreshUserData: Function
    refetchI: Function
    signout: Function
}>({
    user: undefined,
    myRoles: [],
    refreshUserData: () => {
    },
    refetchI: () => {
    },
    signout: () => {
    }
});

export const UserContextProvider = ({children}: { children: ReactNode }) => {

    const {data, loading, refetch} = useQuery(GET_ME);
    const [signout] = useMutation(SIGNOUT);
    const {data: dataI, loading: loadingI, refetch: refetchI} = useQuery(GET_INVENTORY);

    const user = data?.getme;
    const myRoles = dataI?.geyMyInventory;

    return (
        <UserContext.Provider
            value={{
                user,
                myRoles,
                refetchI,
                refreshUserData: refetch,
                signout: () => signout().then(() => refetch())
            }}
        >
            {(loading || loadingI) ? loadingMessage : children}
        </UserContext.Provider>
    );
};

export default UserContext;
