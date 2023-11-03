import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from 'react';
import {gql, useMutation, useQuery, useSubscription} from '@apollo/client';
import UserContext from "./UserContext.tsx";

const GET_SESSIONS = gql`
  query Query($pairId: String!) {
    getsessions(pairId: $pairId)
  }
`;

const GET_TRIPLETS = gql`
  query Query($sessionId: String!) {
    gettriplets(sessionId: $sessionId)
  }
`;

const CREATE_SESSION = gql`
  mutation CreateSession($pairId: String!) {
    createsession(pairId: $pairId)
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
    sessions: string[];
    selectedSession: string;
    setSelectedSession: Dispatch<SetStateAction<string>>;
    triplets: { me: string; him: string; ai: string }[];
    createSession: (pairId: string) => void;
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
    const {data: dataSessions} = useQuery(GET_SESSIONS, {variables: {pairId}});
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

    const createSession = (pairId: string) => createSessionMutation({variables: {pairId}});
    const sendMessage = (sessionId: string, message: string) =>
        sendMessageMutation({variables: {sessionId, message}});

    const {data: subscriptionData} = useSubscription(NEW_MESSAGE_SUBSCRIPTION);

    useEffect(() => {
        if (subscriptionData) {
            const newMessage = subscriptionData.newMessage;
            addMessageToTriplets(newMessage);
        }
    }, [subscriptionData]);

    const addMessageToTriplets = (message: Message) => {
        setTriplets(prevTriplets => {
            debugger;
            // If there are no triplets or the last triplet is complete, add a new triplet
            if (prevTriplets.length === 0 || Object.values(prevTriplets[prevTriplets.length - 1]).every(m => m !== '')) {
                const newTriplet = {
                    me: message.ownerid === user.phone ? message.message : '',
                    him: message.ownerid === pairId ? message.message : '',
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
                        } else if (message.ownerid === pairId && triplet.him === '') {
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


    const sessions = dataSessions?.getsessions || [];

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
