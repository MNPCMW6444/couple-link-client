import {createContext, Dispatch, ReactNode, SetStateAction, useState} from "react";
import {gql, useMutation, useQuery} from "@apollo/client";

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

type ChatContextType = {
    pairId: string,
    setPairId: Dispatch<SetStateAction<string>>,
    sessions: string[],
    selectedSession: string,
    setSelectedSession: Dispatch<SetStateAction<string>>,
    triplets: { me: string, him: string, ai: string } [],
    createSession: (pairId: string) => void,
    sendMessage: (sessionId: string, message: string) => void,
};

const defaultValues: ChatContextType = {
    pairId: "",
    setPairId: () => {
    },
    sessions: [],
    selectedSession: "",
    setSelectedSession: () => {
    },
    triplets: [],
    createSession: () => {
    },
    sendMessage: () => {
    },
};

export const ChatContext = createContext<ChatContextType>(defaultValues);

export const ChatContextProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [pairId, setPairId] = useState<string>("");
    const {data: dataSessions} = useQuery(GET_SESSIONS, {variables: {pairId}});
    const [selectedSession, setSelectedSession] = useState<string>("");
    const {data: dataTriplets} = useQuery(GET_TRIPLETS, {variables: {sessionId: selectedSession}});
    const sessions = dataSessions?.getsessions || [];
    const triplets = dataTriplets?.gettriplets || [];

    const [createSessionMutation] = useMutation(CREATE_SESSION);
    const [sendMessageMutation] = useMutation(SEND_MESSAGE);

    const createSession = (pairId: string) => createSessionMutation({variables: {pairId}});
    const sendMessage = (sessionId: string, message: string) => sendMessageMutation({variables: {sessionId, message}});


    return (
        <ChatContext.Provider value={{
            pairId,
            setPairId,
            sessions,
            selectedSession,
            setSelectedSession,
            triplets,
            createSession,
            sendMessage
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export default ChatContext;
