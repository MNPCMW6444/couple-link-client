import {Grid} from "@mui/material";
import {createContext, ReactNode, useContext, useEffect} from "react";
import {
    gql,
    useQuery,
    useMutation,
    useSubscription
} from "@apollo/client";
import UserContext, {WhiteTypography} from "./UserContext.tsx";

const LOADING_MESSAGE = (
    <Grid height="100vh" width="100vw" container justifyContent="center" alignItems="center">
        <Grid item>
            <WhiteTypography>Loading contacts...</WhiteTypography>
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

const NEW_INVITATION_SUBSCRIPTION = gql`
    subscription NewInvitation {
        newInvitation {
            initiator
            acceptor
            active
            _id
            createdAt
            updatedAt
        }
    }
`;

const INVITATION_ACCEPTED_SUBSCRIPTION = gql`
    subscription InvitationAccepted {
        invitationAccepted {
            initiator
            acceptor
            active
            _id
            createdAt
            updatedAt
        }
    }
`;

interface ContactsContextType {
    contacts: string[];
    contactsIds: string[];
    invitations: string[];
    sentInvitations: string[];
    acceptInvitation?: any
}

const defaultValue: ContactsContextType = {
    contacts: [],
    contactsIds: [],
    invitations: [],
    sentInvitations: [],
};

const ContactsContext = createContext<ContactsContextType>(defaultValue);

export const ContactsContextProvider = ({children}: { children: ReactNode }) => {
    const {user} = useContext(UserContext);

    const contactsQuery = useQuery(CONTACTS_QUERY);
    const invitationsQuery = useQuery(INVITATIONS_QUERY, {variables: {sent: false}});
    const sentInvitationsQuery = useQuery(INVITATIONS_QUERY, {variables: {sent: true}});

    const [acceptInvitation] = useMutation(gql`
        mutation Mutation($phone: String!) {
          agreepair(phone: $phone)
        }
    `);

    const {data: newInvitationData} = useSubscription(NEW_INVITATION_SUBSCRIPTION);
    const {data: invitationAcceptedData} = useSubscription(INVITATION_ACCEPTED_SUBSCRIPTION);

    useEffect(() => {
        if (user) {
            contactsQuery.refetch();
            invitationsQuery.refetch();
            sentInvitationsQuery.refetch();
        }
    }, [user, newInvitationData, invitationAcceptedData]);

    const extractData = (query: typeof contactsQuery, key: string) => {
        if (!query.loading && !query.error && query.data?.[key]) {
            return query.data[key];
        }
        return [];
    };

    const contactsJSON: string[] = extractData(contactsQuery, "getcontacts");
    const contacts = contactsJSON.map((json) => JSON.parse(json).phone);
    const contactsIds = contactsJSON.map((json) => JSON.parse(json).pairId);
    const invitations = extractData(invitationsQuery, "getinvitations");
    const sentInvitations = extractData(sentInvitationsQuery, "getinvitations");

    const isLoading = contactsQuery.loading || invitationsQuery.loading || sentInvitationsQuery.loading;

    return (
        <ContactsContext.Provider value={{contacts, contactsIds, invitations, sentInvitations, acceptInvitation}}>
            {isLoading ? LOADING_MESSAGE : children}
        </ContactsContext.Provider>
    );
};

export default ContactsContext;
