import styled from "@emotion/styled";
import {useEffect, useState} from "react";

interface ChatTripletProps {
    triplet: {
        me: string;
        him: string;
        ai: string;
    };
}

const FlexRow = styled('div')`
  display: flex;
  flexDirection: 'row';
  justifyContent: 'center';
  alignItems: 'center';
`;

const Column = styled('div')`
  display: 'flex';
  flexDirection: 'column';
  justifyContent: 'center';
  alignItems: 'center';
  flex: 1;
`;

const DesktopMessage = styled('div')`
  display: 'flex';
  alignItems: 'center';
  justifyContent: 'center';
  wordWrap: 'break-word';
  padding: '8px';
  flex: 1;
`;

const Balloon = styled('div')(({isMe, isAi}) => ({
    background: isAi ? '#e0e0e0' : isMe ? '#DCF8C6' : '#FFEEEE',
    borderRadius: '20px',
    padding: '10px 16px',
    maxWidth: '80%',
    alignSelf: isMe ? 'flex-end' : isAi ? 'center' : 'flex-start',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    margin: '5px 10px',
    flex: '0 0 auto', // Prevent flexbox from stretching the balloons
}));

const TripletDivider = styled('div')`
  borderBottom: '0.5px dashed gray';
  width: '100%';
  margin: '10px 0';
`;

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
        <FlexRow>
            <Column>
                <DesktopMessage>
                    <Balloon isMe>{triplet.me}</Balloon>
                </DesktopMessage>
            </Column>
            <Column>
                <DesktopMessage>
                    <Balloon isAi>{triplet.ai}</Balloon>
                </DesktopMessage>
            </Column>
            <Column>
                <DesktopMessage>
                    <Balloon>{triplet.him}</Balloon>
                </DesktopMessage>
            </Column>
            <TripletDivider/>
        </FlexRow>
    );

    const mobileView = (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <Balloon isMe>{triplet.me}</Balloon>
            <Balloon>{triplet.him}</Balloon>
            <Balloon isAi>{triplet.ai}</Balloon>
            <TripletDivider/>
        </div>
    );

    return isDesktopView ? desktopView : mobileView;
};

export default ChatTriplet;
