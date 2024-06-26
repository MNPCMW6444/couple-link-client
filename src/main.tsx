import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {Box} from "@mui/material";


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(function (registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(function (error) {
            console.log('Service Worker registration failed:', error);
        });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Box height="100vh" width="100vw" overflow="hidden">
            <App/>
        </Box>
    </React.StrictMode>,
)
