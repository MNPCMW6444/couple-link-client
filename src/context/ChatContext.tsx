import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from 'react';
import {gql, useMutation, useQuery, useSubscription} from '@apollo/client';
import UserContext from "./UserContext";
import ContactsContext from "./ContactsContext";


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
  mutation Createsession($pairId: String!, $sessionName: String!) {
      createsession(pairId: $pairId, sessionName: $sessionName) {
        pairId
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
  subscription NewMessage {
    newMessage {
      owner
      ownerid
      sessionId
      message
      _id
      createdAt
      updatedAt
    }
  }
`;


const NEW_SESSION_SUBSCRIPTION = gql`
  subscription NewSession {
    newSession {
        _id
    }
  }
`;


type Message = {
    owner: string;
    ownerid: string;
    sessionId: string;
    message: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
};

type ChatContextType = {
    pairId: string;
    setPairId: Dispatch<SetStateAction<string>>;
    sessions: Session[];
    selectedSession: string;
    setSelectedSession: Dispatch<SetStateAction<string>>;
    triplets: { me: string; him: string; ai: string }[];
    createSession: (pairId: string, name: string) => void;
    sendMessage: (sessionId: string, message: string) => void;
    addMessageToTriplets: (message: Message) => void;
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
    createSession: () => {
    },
    sendMessage: () => {
    },
    addMessageToTriplets: () => {
    },
};

export const ChatContext = createContext<ChatContextType>(defaultValues);

export const ChatContextProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [pairId, setPairId] = useState<string>('');
    const {data: dataSessions, refetch} = useQuery(GET_SESSIONS, {variables: {pairId}});
    const [selectedSession, setSelectedSession] = useState<string>('');
    const {data: dataTriplets} = useQuery(GET_TRIPLETS, {variables: {sessionId: selectedSession}});
    const [triplets, setTriplets] = useState<{ me: string; him: string; ai: string }[]>([]);
    const {user} = useContext(UserContext)

    useEffect(() => {
        if (dataTriplets) {
            setTriplets(
                dataTriplets.gettriplets.map((array: string[]) => ({
                    me: array[0],
                    him: array[1],
                    ai: array[2],
                }))
            );
        }
    }, [dataTriplets]);

    const [createSessionMutation] = useMutation(CREATE_SESSION);
    const [sendMessageMutation] = useMutation(SEND_MESSAGE);

    const createSession = (pairId: string, name: string) => createSessionMutation({
        variables: {
            pairId,
            sessionName: name
        }
    });
    const sendMessage = (sessionId: string, message: string) =>
        sendMessageMutation({variables: {sessionId, message}});

    const {contacts, contactsIds} = useContext(ContactsContext);

    const {data: messageSubscriptionData} = useSubscription(NEW_MESSAGE_SUBSCRIPTION);
    const {data: sessionSubscriptionData} = useSubscription(NEW_SESSION_SUBSCRIPTION);

    useEffect(() => {
        if (messageSubscriptionData) {
            const newMessage = messageSubscriptionData.newMessage;
            addMessageToTriplets(newMessage);
        }
        if (sessionSubscriptionData) {
            addSession();
        }
    }, [messageSubscriptionData, sessionSubscriptionData]);

    const addMessageToTriplets = (message: Message) => {
        setTriplets(prevTriplets => {
            // If there are no triplets or the last triplet is complete, add a new triplet
            if (prevTriplets.length === 0 || Object.values(prevTriplets[prevTriplets.length - 1]).every(m => m !== '')) {
                const newTriplet = {
                    me: message.ownerid === user.phone ? message.message : '',
                    him: message.owner === contacts[contactsIds.findIndex((id) => id === pairId)] ? message.message : '',
                    ai: message.ownerid === 'ai' ? message.message : '',
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
                        } else if (message.owner === contacts[contactsIds.findIndex((id) => id === pairId)] && triplet.him === '') {
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
    };


    const addSession = () => {
        refetch().then(() => {
        });
    };


    const sessions: Session [] = dataSessions?.getsessions || [];

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
                addMessageToTriplets,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatContext;
