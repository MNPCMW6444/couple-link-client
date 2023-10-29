import {Typography, Grid} from "@mui/material";
import {createContext, ReactNode} from "react";
import {gql, useQuery} from "@apollo/client";

const LOADING_MESSAGE = (
    <Grid height="100vh" width="100vw" container justifyContent="center" alignItems="center">
        <Grid item>
            <Typography>Loading contacts...</Typography>
        </Grid>
    </Grid>
);

const CONTACTS_QUERY = gql`
    query {
        getcontacts
    }
`;

const INVITATIONS_QUERY = gql`
    query InvitationsQuery($sent: Boolean!) {
        getinvitations(sent: $sent)
    }
`;

interface ContactsContextType {
    contacts: string[];
    invitations: string[];
    sentInvitations: string[];
}

const defaultValue: ContactsContextType = {
    contacts: [],
    invitations: [],
    sentInvitations: []
};

const ContactsContext = createContext<ContactsContextType>(defaultValue);

export const ContactsContextProvider = ({children}: { children: ReactNode }) => {
    const contactsQuery = useQuery(CONTACTS_QUERY);
    const invitationsQuery = useQuery(INVITATIONS_QUERY, {variables: {sent: false}});
    const sentInvitationsQuery = useQuery(INVITATIONS_QUERY, {variables: {sent: true}});

    const extractData = (query: typeof contactsQuery, key: string) => {
        if (!query.loading && !query.error && query.data?.[key]) {
            return query.data[key];
        }
        return [];
    };

    const contacts = extractData(contactsQuery, "getcontacts");
    const invitations = extractData(invitationsQuery, "getinvitations");
    const sentInvitations = extractData(sentInvitationsQuery, "getinvitations");

    const isLoading = contactsQuery.loading || invitationsQuery.loading || sentInvitationsQuery.loading;

    return (
        <ContactsContext.Provider value={{contacts, invitations, sentInvitations}}>
            {isLoading ? LOADING_MESSAGE : children}
        </ContactsContext.Provider>
    );
};

export default ContactsContext;
