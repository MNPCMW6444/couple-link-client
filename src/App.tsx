import {createTheme, ThemeProvider} from "@mui/material";
import ChatPage from "./components/chat/ChatPage.tsx";
import {Global, css} from "@emotion/react";
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';

const serverURI = "http://localhost:6005/graphql";

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

    const client = new ApolloClient({
        uri: serverURI,
        cache: new InMemoryCache(),
    });


    return <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>

            <Global styles={globalStyles}/>

        </ApolloProvider>

        <ChatPage/>

    </ThemeProvider>


}

export default App