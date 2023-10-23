import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {Box} from "@mui/material";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Box width="100vw" height="100vh">
            <App/>
        </Box>
    </React.StrictMode>,
)
