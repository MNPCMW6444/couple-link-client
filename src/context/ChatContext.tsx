import {createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState} from 'react';
import {gql, useMutation, useQuery, useSubscription} from '@apollo/client';
import /*UserContext,*/ {WhiteTypography} from "./UserContext";
import ContactsContext from "./ContactsContext";
import {Grid} from "@mui/material";


const GET_SESSIONS = gql`
  query Getsessions($pairId: String!) {
      getsessions(pairId: $pairId) {
        name
        _id
      }
}
`;

type Session = {
    name: string;
    _id: string;
}

const GET_TRIPLETS = gql`
  query Query($sessionId: String!) {
    gettriplets(sessionId: $sessionId)
  }
`;

const CREATE_SESSION = gql`
  mutation Createsession($pairId: String!, $sessionName: String!, $role: String!) {
      createsession(pairId: $pairId, sessionName: $sessionName, role: $role) {
        pairId
        roleId
        name
        _id
        createdAt
        updatedAt
      }
  }
`;


const SEND_MESSAGE = gql`
  mutation SendMessage($sessionId: String!, $message: String!) {
    sendmessage(sessionId: $sessionId, message: $message)
  }
`;

const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription Subscription($sessionId: String) {
      newMessage(sessionId: $sessionId)
   }
`;


const NEW_SESSION_SUBSCRIPTION = gql`
  subscription NewSession {
    newSession {
        _id
    }
  }
`;


const DELETE_SESSION = gql`
    mutation DeleteSession($sessionId: String!) {
      deleteSession(sessionId: $sessionId)
    }
`;

/*
type Message = {
    owner: string;
    ownerid: string;
    sessionId: string;
    message: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    whenQueried: string;
};*/

export interface Triplet {
    me: string;
    him: string;
    ai: string,
    v2: string
}

type ChatContextType = {
    pairId: string;
    setPairId: Dispatch<SetStateAction<string>>;
    sessions: Session[];
    selectedSession: string;
    setSelectedSession: Dispatch<SetStateAction<string>>;
    triplets: Triplet [];
    createSession: (pairId: string, name: string, role: string) => Promise<any>;
    sendMessage: (sessionId: string, message: string) => void;
    /*
        addMessageToTriplets: (message: Message) => void;
    */
    refetch?: any;
    deleteSessionById?: Function;
};

const defaultValues: ChatContextType = {
    pairId: '',
    setPairId: () => {
    },
    sessions: [],
    selectedSession: '',
    setSelectedSession: () => {
    },
    triplets: [],
    createSession: async () => {
    },
    sendMessage: () => {
    },
    /* addMessageToTriplets: () => {
     },*/
};

export const ChatContext = createContext<ChatContextType>(defaultValues);

export const ChatContextProvider: FC<{ children: ReactNode }> = ({children}) => {
    const [pairId, setPairId] = useState<string>('');
    const {data: dataSessions, loading, refetch} = useQuery(GET_SESSIONS, {variables: {pairId}});
    const [selectedSession, setSelectedSession] = useState<string>('');
    const {data: dataTriplets, refetch: dref} = useQuery(GET_TRIPLETS, {variables: {sessionId: selectedSession}});
    const [triplets, setTriplets] = useState<Triplet[]>([]);
    /*
        const {user} = useContext(UserContext)
    */

    useEffect(() => {
        if (dataTriplets) {
            setTriplets(
                dataTriplets.gettriplets?.map((array: string[]) => ({
                    me: array[0],
                    him: array[1],
                    ai: array[2],
                    v2: array[3]
                }))
            );
        }
    }, [dataTriplets]);

    const [createSessionMutation] = useMutation(CREATE_SESSION);
    const [sendMessageMutation] = useMutation(SEND_MESSAGE);
    const [deleteSession] = useMutation(DELETE_SESSION);

    const deleteSessionById = async (sessionId: string) => deleteSession({variables: {sessionId}}).then(() => refetch());

    const createSession = async (pairId: string, name: string, role: string) => createSessionMutation({
        variables: {
            pairId,
            sessionName: name,
            role
        }
    });

    const sendMessage = (sessionId: string, message: string) =>
        sendMessageMutation({variables: {sessionId, message}});

    const {contacts: x, contactsIds} = useContext(ContactsContext);
    const contacts = x.map((contact: any) => contact.phone);
    const contactsNames = x.map((contact: any) => contact.name);

    const {data: messageSubscriptionData} = useSubscription(NEW_MESSAGE_SUBSCRIPTION, {variables: {sessionId: selectedSession}});
    const {data: sessionSubscriptionData} = useSubscription(NEW_SESSION_SUBSCRIPTION);

    useEffect(() => {
        // Parse URL parameters
        const queryParams = new URLSearchParams(window.location.search);
        const urlPairId = queryParams.get('pairId');
        const urlSessionId = queryParams.get('sessionId');

        // Sets context state if parameters are present
        if (urlPairId) setPairId(urlPairId);
        if (urlSessionId) setSelectedSession(urlSessionId);
    }, []);


    useEffect(() => {
        if (messageSubscriptionData) {
            dref()
        }
        if (sessionSubscriptionData) {
            addSession();
        }
    }, [messageSubscriptionData, sessionSubscriptionData]);

    /*  const addMessageToTriplets = (message: Message) => {
          setTriplets(prevTriplets => {
              // If there are no triplets or the last triplet is complete, add a new triplet
              if (prevTriplets.length === 0 || Object.values(prevTriplets[prevTriplets.length - 1]).every(m => m !== '')) {
                  const newTriplet = {
                      me: message.ownerid === user.phone ? message.message : '',
                      him: message.owner === contacts[contactsIds.findIndex((id: any) => id === pairId)] ? message.message : '',
                      ai: message.ownerid === 'ai' ? message.message : '',
                      v2: message.ownerid === user.phone && message.whenQueried ? message.whenQueried : "-1"
                  };
                  return [...prevTriplets, newTriplet];
              } else {
                  // Otherwise, add the message to the incomplete triplet
                  return prevTriplets.map((triplet, index) => {
                      if (index === prevTriplets.length - 1) {
                          // Assuming the message owner can be 'me', 'him', or 'ai'
                          const updatedTriplet = {...triplet};
                          if (message.ownerid === user._id && triplet.me === '') {
                              updatedTriplet.me = message.message;
                          } else if (message.owner === contacts[contactsIds.findIndex((id: any) => id === pairId)] && triplet.him === '') {
                              updatedTriplet.him = message.message;
                          } else if (message.ownerid === 'ai' && triplet.ai === '') {
                              updatedTriplet.ai = message.message;
                          }
                          return updatedTriplet;
                      }
                      return triplet;
                  });
              }
          });
      };*/


    const addSession = () => {
        refetch().then(() => {
        });
    };


    const sessions: Session [] = dataSessions?.getsessions || [];


    const index = contactsIds.findIndex((id: any) => id === pairId);
    const contact = contactsNames[index] || contacts[index]

    return (
        <ChatContext.Provider
            value={{
                pairId,
                setPairId,
                sessions,
                selectedSession,
                setSelectedSession,
                triplets,
                createSession,
                sendMessage,
                /*
                                addMessageToTriplets,
                */
                refetch: dref,
                deleteSessionById
            }}
        >
            {loading ? <Grid height="100vh" width="100vw" container justifyContent="center" alignItems="center">
                <Grid item>
                    <WhiteTypography>
                        Loading your Sessions{contact ? (" with " + contact) : ""}...
                    </WhiteTypography>
                </Grid>
            </Grid> : children}
        </ChatContext.Provider>
    );
};

export default ChatContext;
