import {Typography, Grid} from "@mui/material";
import {createContext, ReactNode, useContext} from "react";
import {gql, useQuery} from "@apollo/client";
import UserContext from "./UserContext.tsx";


const loadingMessage = (
    <Grid height="100vh" width="100vw" container justifyContent="center" alignItems="center">
        <Grid item>
            <Typography>
                Loading contacts...
            </Typography>
        </Grid>
    </Grid>
);

const ContactsContext = createContext<{
    contacts: string [];
}>({
    contacts: []
});

export const ContactsContextProvider = ({children}: { children: ReactNode }) => {

    const {data, loading, error} = useQuery(gql`
        query Getcontacts {
          getcontacts {
            acceptor
            initiator
          }
        }
    `);

    const {user} = useContext(UserContext);

    const res = data?.getcontacts;

    let contacts = [];
    if (!loading && !error && data?.getcontacts) {
        contacts = res.map((contact: { acceptor: string; initiator: string; }) => {
            return contact.acceptor === user._id ? contact.initiator : contact.acceptor;
        });
    }
    return (<ContactsContext.Provider
            value={{
                contacts: !loading && contacts
            }}>
            {loading ? loadingMessage : children}
        </ContactsContext.Provider>
    );
};

export default ContactsContext;
