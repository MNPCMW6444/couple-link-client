import {FC} from "react";
import {Box, Typography, Divider, Paper, Stack} from "@mui/material";

interface FullCardProps {
    item: {
        creatorId: string;
        name: string;
        publicName: string;
        role: string;
        setId: string;
        attributes: any; // Adjust the type as per your data model
        description: string;
        aiMessage: string;
        visibility: boolean;
        _id: string;
        createdAt: string;
        updatedAt: string;
    }
}

const FullCard: FC<FullCardProps> = ({item}) => {
    const {
        creatorId,
        name,
        publicName,
        role,
        setId,
        attributes,
        description,
        aiMessage,
        visibility,
        _id,
        createdAt,
        updatedAt
    } = item;

    return (
        <Box
            component={Paper}
            width="80vw"
            height="80vh"
            margin="10vh 10vw"
            padding={3}
            overflow="auto"
        >
            <Typography variant="h4" gutterBottom>{name}</Typography>
            <Divider/>
            <Stack spacing={2} marginY={2}>
                {publicName && <Typography variant="subtitle1">Public Name: {publicName}</Typography>}
                <Typography variant="body1">Role: {role}</Typography>
                <Typography variant="body1">Set ID: {setId}</Typography>
                <Typography variant="body1">Category: {attributes?.category}</Typography>
                <Typography variant="body1">Description: {description}</Typography>
                {aiMessage && <Typography variant="body1">AI Message: {aiMessage}</Typography>}
                <Typography variant="body1">Visibility: {visibility ? 'Visible' : 'Not Visible'}</Typography>
                <Typography variant="body1">Creator ID: {creatorId}</Typography>
                <Typography variant="body1">Listing ID: {_id}</Typography>
                <Typography variant="body1">Created At: {new Date(createdAt).toLocaleDateString()}</Typography>
                <Typography variant="body1">Updated At: {new Date(updatedAt).toLocaleDateString()}</Typography>
                {/* Display other attributes if available */}
                {attributes && Object.keys(attributes).map(key => (
                    <Typography variant="body1" key={key}>{key}: {attributes[key]}</Typography>
                ))}
            </Stack>
        </Box>
    );
};

export default FullCard;
