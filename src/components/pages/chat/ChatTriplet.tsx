import styled from "@emotion/styled";
import {FC, useEffect, useState} from "react";

interface ChatTripletProps {
    triplet: {
        me: string;
        him: string;
        ai: string;
    };
}

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const DesktopMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  word-wrap: break-word;
  padding: 8px;
  flex: 1;
`;

const Balloon: any = styled.div`
  background: ${(props: any) => (props.isAi ? '#e0e0e0' : props.isMe ? '#DCF8C6' : '#FFEEEE')};
  border-radius: 20px;
  padding: 10px 16px;
  max-width: 80%;
  align-self: ${(props: any) => (props.isMe ? 'flex-end' : props.isAi ? 'center' : 'flex-start')};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  margin: 5px 10px;
  flex: 0 0 auto;
`;

const TripletDivider = styled.div`
  border-bottom: 0.5px dashed gray;
  width: 100%;
  margin: 10px 0;
`;

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
        </FlexRow>
    );

    const mobileView = (
        <FlexRow>
            <Balloon isMe>{triplet.me}</Balloon>
            <Balloon>{triplet.him}</Balloon>
            <Balloon isAi>{triplet.ai}</Balloon>
            <TripletDivider/>
        </FlexRow>
    );

    return (
        <div>
            {isDesktopView ? desktopView : mobileView}
            <TripletDivider/>
        </div>
    );
};

export default ChatTriplet;
