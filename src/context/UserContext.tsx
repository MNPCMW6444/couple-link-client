import {
    ReactNode,
    createContext,
} from "react";

import {Typography, Grid} from "@mui/material";
import {styled} from "@mui/system";
import {gql, useMutation, useQuery} from "@apollo/client";


export const WhiteTypography = styled(Typography)(({theme}) => ({
    fontWeight: "bold",
    fontSize: 32,
    letterSpacing: 2,
    color: theme.palette.primary,
    marginBottom: theme.spacing(1),
}));

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
    refreshUserData: Function
    signout: Function
}>({
    user: undefined,
    refreshUserData: () => {
    },
    signout: () => {
    }
});

export const UserContextProvider = ({children}: { children: ReactNode }) => {


    const {data, loading, refetch} = useQuery(gql`query Getme {
  getme {
    _id
    phone
    rnd
  }
}`);

    const [signout] = useMutation(gql`
        mutation Mutation {
          signout
        }
    `);


    const user = data?.getme;


    return (
        <UserContext.Provider
            value={{
                user,
                refreshUserData: refetch,
                signout: () => signout().then(() => refetch())
            }}
        >
            {loading ? loadingMessage : children}
        </UserContext.Provider>
    );
};

export default UserContext;
