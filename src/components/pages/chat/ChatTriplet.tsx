import styled from "@emotion/styled";
import {FC, useEffect, useState} from "react";
import {Typography} from "@mui/material";
import {isNight} from "../../../App.tsx";

interface ChatTripletProps {
    triplet: {
        me: string;
        him: string;
        ai: string;
    };
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


const Balloon = styled(Typography)(({theme, isAi, isMe}: any) => ({
    background: isAi ? (!isNight ? "#e0e0e0" : "#707070") : isMe ? (!isNight ? theme.palette.primary.dark : theme.palette.secondary.dark) : (!isNight ? theme.palette.primary.light : theme.palette.secondary.main),
    color: isNight && theme.palette.primary.contrastText,
    borderRadius: '20px',
    padding: '10px 16px',
    maxWidth: '80%',
    alignSelf: isMe ? 'flex-end' : isAi ? 'center' : 'flex-start',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    margin: '5px 0',
    flex: '0 0 auto',
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
                    <Balloon>{triplet.him}</Balloon>
                </DesktopMessage>
            </Column>
            <Column>
                <DesktopMessage>
                    <Balloon isAi>{triplet.ai}</Balloon>
                </DesktopMessage>
            </Column>
            <Column>
                <DesktopMessage>
                    <Balloon isMe>{triplet.me}</Balloon>
                </DesktopMessage>
            </Column>
        </FlexRow>
    );

    const mobileView = (
        <div style={{display: 'flex', flexDirection: 'column-reverse'}}>
            <Balloon isMe>{triplet.me}</Balloon>
            <Balloon isAi>{triplet.ai}</Balloon>
            <Balloon>{triplet.him}</Balloon>
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
