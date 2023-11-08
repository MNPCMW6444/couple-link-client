import styled from "@emotion/styled";
import {useEffect, useState} from "react";

interface ChatTripletProps {
    triplet: {
        me: string;
        him: string;
        ai: string;
    };
}

const Column = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
});


const Message = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    wordWrap: 'break-word',
    padding: '8px',
    minHeight: '50px',  // Adjust based on your desired minimum height
});


const DesktopBalloon = styled('div')({
    background: '#e0e0e0',   // A light gray, you can adjust the color
    borderRadius: '15px',
    padding: '8px 12px',
    maxWidth: '80%',   // Making sure balloons don't span the entire width
});

const Balloon = styled.div(({isMe, isAi}: any) => ({
    background: isAi ? '#e0e0e0' : isMe ? '#DCF8C6' : '#FFEEEE',
    borderRadius: '20px',
    padding: '10px 16px',
    maxWidth: '80%',
    alignSelf: isMe ? 'flex-end' : isAi ? 'center' : 'flex-start',
    position: 'relative',
    fontSize: '16px',
    boxShadow: isAi ? '0 1px 3px rgba(0, 0, 0, 0.2)' : '0 2px 5px rgba(0, 0, 0, 0.2)',
    margin: '5px 0',
    '&::before, &::after': isAi
        ? {
            content: '""',
            position: 'absolute',
            background: '#e0e0e0',
            borderRadius: '50%',
            zIndex: '-1',
        }
        : null,
    ...(isAi
        ? {
            '&::before': {
                all: 'unset',
                content: '""',
                position: 'absolute',
                top: '-5px',
                right: '30%',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#e0e0e0',
            },
            '&::after': {
                all: 'unset',
                content: '""',
                position: 'absolute',
                top: '-5px',
                left: '30%',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#e0e0e0',
            },
            borderRadius: '30px',
            boxShadow: `
          0px 0px 0 10px #e0e0e0, /* Main cloud body */
          20px 10px 0 -5px #e0e0e0, /* Right small puff */
          -20px 10px 0 -5px #e0e0e0, /* Left small puff */
          10px -10px 0 -2px #e0e0e0, /* Top right small puff */
          -10px -10px 0 -2px #e0e0e0, /* Top left small puff */
          0 15px 0 -5px #e0e0e0, /* Bottom small puff */
          0 8px 10px rgba(0, 0, 0, 0.05) /* Soft shadow for depth */
        `,
        }
        : {}),
}));
const TripletDivider = styled('div')({
    borderBottom: '0.5px dashed gray',
    width: '100%',
    margin: '10px 0',
});

const ChatTriplet: React.FC<ChatTripletProps> = ({triplet}) => {
    const [isDesktopView, setIsDesktopView] = useState(window.innerWidth > 1000);

    const updateMedia = () => {
        setIsDesktopView(window.innerWidth > 1000);
    };

    useEffect(() => {
        window.addEventListener('resize', updateMedia);
        return () => window.removeEventListener('resize', updateMedia);
    });

    const desktopView = (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <Column>
                    <Message>
                        <DesktopBalloon>{triplet.me}</DesktopBalloon>
                    </Message>
                </Column>
                <Column>
                    <Message>
                        <DesktopBalloon>{triplet.ai}</DesktopBalloon>
                    </Message>
                </Column>
                <Column>
                    <Message>
                        <DesktopBalloon>{triplet.him}</DesktopBalloon>
                    </Message>
                </Column>
            </div>
            <TripletDivider/>
        </div>
    );

    const mobileView = (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <Balloon isMe>{triplet.me}</Balloon>
            <br/>
            <Balloon>{triplet.him}</Balloon>
            <br/>
            <Balloon isAi>{triplet.ai}</Balloon>
            <TripletDivider/>
        </div>
    );

    return isDesktopView ? desktopView : mobileView;
};

export default ChatTriplet;
