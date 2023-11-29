import {Modal, Box, Typography, Button} from '@mui/material';

function InstallModal({onInstallClicked}: any) {
    return (
        <Modal open={true}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 300,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Typography variant="h6" sx={{mb: 2}}>
                    Install App
                </Typography>
                <Typography sx={{mb: 2}}>
                    Add this application to your home screen for a better experience.
                </Typography>
                <Button variant="contained" color="primary" onClick={onInstallClicked}>
                    Install
                </Button>
            </Box>
        </Modal>
    );
}

export default InstallModal;
