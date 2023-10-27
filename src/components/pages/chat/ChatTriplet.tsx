import styled from "@emotion/styled";


interface ChatTripletProps {
    triplet: {
        me: string;
        him: string;
        ai: string;
    };
}

const Column = styled('div')({
    width: '33.33%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',  // Vertically centering content
    borderRight: '1px solid black',
    '&:last-child': {
        borderRight: 'none',
    },
});


const Message = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    wordWrap: 'break-word',
    padding: '8px',
    minHeight: '50px',  // Adjust based on your desired minimum height
});


const Balloon = styled('div')({
    background: '#e0e0e0',   // A light gray, you can adjust the color
    borderRadius: '15px',
    padding: '8px 12px',
    maxWidth: '80%',   // Making sure balloons don't span the entire width
});


const TripletDivider = styled('div')({
    borderBottom: '0.5px dashed gray',
    width: '100%',
});


const ChatTriplet: React.FC<ChatTripletProps> = ({triplet}) => {
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <Column>
                    <Message>
                        <Balloon>{triplet.me}</Balloon>
                    </Message>
                </Column>
                <Column>
                    <Message>
                        <Balloon>{triplet.him}</Balloon>
                    </Message>
                </Column>
                <Column>
                    <Message>
                        <Balloon>{triplet.ai}</Balloon>
                    </Message>
                </Column>
            </div>
            <TripletDivider/>
        </div>
    );
};


export default ChatTriplet