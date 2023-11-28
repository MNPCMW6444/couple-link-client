import {createTheme, ThemeProvider} from "@mui/material";
import {Global, css} from "@emotion/react";
import {ApolloClient, InMemoryCache, ApolloProvider, HttpLink, split} from '@apollo/client';
import WhiteRouter from "./components/WhiteRouter";
import {UserContextProvider} from "./context/UserContext";
import {ContactsContextProvider} from "./context/ContactsContext";
import {getMainDefinition} from "@apollo/client/utilities";
import {WebSocketLink} from "@apollo/client/link/ws";
import {ChatContextProvider} from "./context/ChatContext";
import {useEffect, useState} from "react";


const serverURI = import.meta.env.VITE_NODE_ENV === "development" ? "://localhost:6005/graphql" : "s://server.dualchatgpt.com/graphql";

const globalStyles = css`
  * {
    box-sizing: border-box;
  }
`;

const theme = createTheme({
    palette: {
        mode: new Date().getHours() > 20 || new Date().getHours() < 6 ? "dark" : "light",
        primary: {
            main: '#d2245d',
            contrastText: '#ffffff',
            light: '#e25684',
            dark: '#711431',
        },
        secondary: {
            main: '#d40e4d',
            light: '#df4a7b',
            dark: '#68122e',
            contrastText: '#ffffff',
        },
    },
    typography: {
        fontSize: 14,
        fontWeightLight: 200,
        fontFamily: 'Source Sans Pro',
    },
});

function App() {
    const [installPrompt, setInstallPrompt] = useState<any>(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const httpLink = new HttpLink({
        uri: "http" + serverURI,
        credentials: 'include',
        fetch: (uri, options, timeout = 120000) => {
            return new Promise((resolve, reject) => {
                const timer = setTimeout(() => {
                    reject(new Error("Request timed out"));
                }, timeout);

                fetch(uri, options).then(
                    response => {
                        clearTimeout(timer);
                        resolve(response);
                    },
                    err => {
                        clearTimeout(timer);
                        reject(err);
                    }
                ).catch(reject);
            });
        }
    });

    const wsLink = new WebSocketLink({
        uri: "ws" + serverURI,
        options: {
            reconnect: true,
        },
    });

    const splitLink = split(
        ({query}) => {
            const definition = getMainDefinition(query);
            return (
                definition.kind === 'OperationDefinition' &&
                definition.operation === 'subscription'
            );
        },
        wsLink,
        httpLink,
    );

    const InstallButton = ({onInstallClicked}: any) => (
        <button onClick={onInstallClicked}>Install App</button>
    );

    const client = new ApolloClient({
        link: splitLink,
        cache: new InMemoryCache(),
    });

    return (
        <ThemeProvider theme={theme}>
            <ApolloProvider client={client}>
                <Global styles={globalStyles}/>
                <UserContextProvider>
                    <ContactsContextProvider>
                        <ChatContextProvider>
                            <WhiteRouter/>
                            {installPrompt && (
                                <InstallButton onInstallClicked={() => {
                                    installPrompt.prompt();
                                    installPrompt.userChoice.then((choiceResult: any) => {
                                        if (choiceResult.outcome === 'accepted') {
                                            console.log('User accepted the install prompt');
                                        } else {
                                            console.log('User dismissed the install prompt');
                                        }
                                        setInstallPrompt(null);
                                    });
                                }}/>
                            )}
                        </ChatContextProvider>
                    </ContactsContextProvider>
                </UserContextProvider>
            </ApolloProvider>
        </ThemeProvider>
    );
}

export default App;
