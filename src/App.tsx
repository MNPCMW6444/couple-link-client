import {Box, createTheme, ThemeProvider} from "@mui/material";
import {Global, css} from "@emotion/react";
import {ApolloClient, InMemoryCache, ApolloProvider, HttpLink, split} from '@apollo/client';
import WhiteRouter from "./components/WhiteRouter";
import {UserContextProvider} from "./context/UserContext";
import {getMainDefinition} from "@apollo/client/utilities";
import {WebSocketLink} from "@apollo/client/link/ws";
import {useEffect, useState} from "react";
import InstallModal from "./InstallModal.tsx";


const serverURI = import.meta.env.VITE_NODE_ENV === "development" ? "://localhost:6005/graphql" : "s://server.dualchatgpt.com/graphql";

const globalStyles = css`
  * {
    box-sizing: border-box;
  }
`;

export const isNight = (new Date().getHours() > 16 || new Date().getHours() < 7)

const theme = createTheme({
    palette: {
        mode: isNight ? 'dark' : 'light',
        primary: {
            main: '#d2245d',
            contrastText: '#ffffff',
            light: '#ed97b4',
            dark: '#eda697',
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
        allVariants: {
            color: isNight ? "white" : "#121212"
        },
    },
});

function App() {
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [isAppInstalled, setIsAppInstalled] = useState(false);

    // Handle the 'appinstalled' event
    useEffect(() => {
        window.addEventListener('appinstalled', () => {
            setIsAppInstalled(true);
        });
    }, []);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Save the event for later (to show the prompt)
            if (!isAppInstalled) {
                setInstallPrompt(e);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [isAppInstalled]);

    const showInstallPrompt = () => {
        installPrompt.prompt();
        // Wait for the user to respond to the prompt
        installPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            setInstallPrompt(null);
        });
    };

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


    const client = new ApolloClient({
        link: splitLink,
        cache: new InMemoryCache(),
    });

    return (<Box height="100%" width="100%" bgcolor={isNight ? "#121212" : "white"}>
            <ThemeProvider theme={theme}>
                <ApolloProvider client={client}>
                    <Global styles={globalStyles}/>
                    <UserContextProvider><WhiteRouter/></UserContextProvider>
                    {installPrompt && !isAppInstalled && (
                        <InstallModal onInstallClicked={showInstallPrompt}/>
                    )}
                </ApolloProvider>
            </ThemeProvider>
        </Box>
    );
}

export default App;
