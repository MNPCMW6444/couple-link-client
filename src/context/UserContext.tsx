import {
    ReactNode,
    createContext,
} from "react";

import {Typography, Grid} from "@mui/material";
import {styled} from "@mui/system";
import {gql, useQuery} from "@apollo/client";


const WhiteTypography = styled(Typography)(({theme}) => ({
    fontFamily: "Monospace",
    fontWeight: "bold",
    fontSize: 32,
    letterSpacing: 2,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
}));

const loadingMessage = (
    <Grid height="100vh" width="100vw" container justifyContent="center" alignItems="center">
        <Grid item>
            <WhiteTypography>
                Loading user account details...
            </WhiteTypography>
        </Grid>
    </Grid>
);

const UserContext = createContext<{
    user?: any;
    refreshUserData: Function
}>({
    user: undefined,
    refreshUserData: () => {
    }
});

export const UserContextProvider = ({children}: { children: ReactNode }) => {


    const {data, loading, refetch} = useQuery(gql`query Getme {
  getme {
    _id
  }
}`);


    const user = data?.getme;


    return (
        <UserContext.Provider
            value={{
                user,
                refreshUserData: refetch
            }}
        >
            {loading ? loadingMessage : children}
        </UserContext.Provider>
    );
};

export default UserContext;
