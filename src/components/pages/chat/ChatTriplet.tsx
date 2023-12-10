import styled from "@emotion/styled";
import {FC, useEffect, useState} from "react";
import {Typography} from "@mui/material";
import {isNight} from "../../../App.tsx";
import {Triplet} from "../../../context/ChatContext.tsx";

interface ChatTripletProps {
    triplet: Triplet;
}

const Container = styled('div')({
    width: '100%',
});

const FlexRow = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
});


const Column = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
});


const DesktopMessage = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    wordWrap: 'break-word',
    padding: '8px',
    flex: 1,
});


const Balloon = styled(Typography)(({theme, isAi, isMe, read}: any) => ({
    background: isAi === "yes" ? (!isNight ? "#e0e0e0" : "#707070") : isMe ? (!isNight ? theme.palette.primary.dark : theme.palette.secondary.dark) : (!isNight ? theme.palette.primary.light : theme.palette.secondary.main),
    color: isNight && theme.palette.primary.contrastText,
    borderRadius: '20px',
    padding: '10px 16px',
    maxWidth: '80%',
    alignSelf: isMe === "yes" ? 'flex-end' : isAi === "yes" ? 'center' : 'flex-start',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    margin: '5px 0',
    flex: '0 0 auto',
    '&:after': {
        content: read == "yes" ? '"\\2713\\2713"' : '""', // Unicode for double checkmarks
        display: read == "yes" ? 'block' : 'none', // Display as block to ensure it's on a new line
        fontSize: '12px',
        marginTop: '4px', // Add margin at the top for spacing
        color: read == "yes" ? '' : "transparent", // Change color based on read status
        textAlign: 'right', // Align to the right
    },
}));


const TripletDivider = styled('div')({
    borderBottom: '0.5px dashed gray',
    width: '100%',
    margin: '10px 0',
});


const ChatTriplet: FC<ChatTripletProps> = ({triplet}) => {
    const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 1000);

    const updateMedia = () => {
        setIsDesktopView(window.innerWidth > 1000);
    };

    useEffect(() => {
        window.addEventListener('resize', updateMedia);
        return () => window.removeEventListener('resize', updateMedia);
    });

    const desktopView = (
        <FlexRow>
            <Column>
                <DesktopMessage>
                    {triplet.him && <Balloon>{triplet.him}</Balloon>}
                </DesktopMessage>
            </Column>
            <Column>
                <DesktopMessage>
                    {triplet.ai && <Balloon isAi="yes">{triplet.ai}</Balloon>}
                </DesktopMessage>
            </Column>
            <Column>
                <DesktopMessage>
                    {triplet.me &&
                        <Balloon isMe="yes"
                                 read={triplet.v2 && triplet.v2 !== "-1" ? "yes" : "no"}>{triplet.me}</Balloon>}
                </DesktopMessage>
            </Column>
        </FlexRow>
    );

    const mobileView = (
        <div style={{display: 'flex', flexDirection: 'column-reverse'}}>
            {triplet.me &&
                <Balloon read={triplet.v2 && triplet.v2 !== "-1" ? "yes" : "no"} isMe="yes">{triplet.me}</Balloon>}
            {triplet.ai && <Balloon isAi="yes">{triplet.ai}</Balloon>}
            {triplet.him && <Balloon>{triplet.him}</Balloon>}
        </div>
    );

    return (
        <Container>
            {isDesktopView ? desktopView : mobileView}
            <TripletDivider/>
        </Container>
    );
};

export default ChatTriplet;
