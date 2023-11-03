import {createTheme, ThemeProvider} from "@mui/material";
import {Global, css} from "@emotion/react";
import {ApolloClient, InMemoryCache, ApolloProvider, HttpLink, split} from '@apollo/client';
import WhiteRouter from "./components/WhiteRouter.tsx";
import {UserContextProvider} from "./context/UserContext.tsx";
import {ContactsContextProvider} from "./context/ContactsContext.tsx";
import {getMainDefinition} from "@apollo/client/utilities";
import {WebSocketLink} from "@apollo/client/link/ws";

import.meta.env.VITE_NODE_ENV


const serverURI = import.meta.env.VITE_NODE_ENV === "development" ? "://localhost:6005/graphql" : "s://server.scailean.com/graphql";

const globalStyles = css`
  * {
    box-sizing: border-box;
  }
`;

function App() {


    const theme = createTheme({
        palette: {
            primary: {
                main: '#009688',  // Teal for primary actions
            },
            secondary: {
                main: '#FF6B6B',  // Coral for contrast and secondary actions
            },
        },
        typography: {
            fontFamily: "'Poppins', sans-serif",
        },
        shape: {
            borderRadius: 12,  // Rounded corners
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        padding: '8px 20px',
                        fontSize: '1rem',
                        transition: 'all 0.3s',
                        boxShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)',  // subtle shadow
                        '&:hover': {
                            transform: 'translateY(-2px)',  // slight lift on hover
                            boxShadow: '2px 4px 14px rgba(0, 0, 0, 0.2)',
                        },
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 12,
                        }
                    }
                }
            }
        }
    });

    const httpLink = new HttpLink({
        uri: "http" + serverURI,
        credentials: 'include'
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


    return <>
        <ThemeProvider theme={theme}>
            <ApolloProvider client={client}>
                <Global styles={globalStyles}/>
                <UserContextProvider>
                    <ContactsContextProvider><WhiteRouter/></ContactsContextProvider>
                </UserContextProvider>
            </ApolloProvider>
        </ThemeProvider>
    </>
}

export default App
