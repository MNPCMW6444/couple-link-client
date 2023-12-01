import {Card, CardContent, Typography, Button, Modal} from '@mui/material';
import {FC, useState} from "react";
import FullCard from "./FullCard.tsx";
import {Item} from "./ShopPage.tsx";
import {gql, useMutation} from "@apollo/client";

interface ListingCardProps {
    item: Item
}

const BUY_MUTATION = gql`
    mutation Buy($id: String!) {
      buy(id: $id)
    }
`

const ListingCard: FC<ListingCardProps> = ({item}) => {
    const {name, category, description} = item
    const [open, setOpen] = useState(false);

    const [buy] = useMutation(BUY_MUTATION)

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">{name}</Typography>
                <Typography color="textSecondary">{category}</Typography>
                <Typography variant="body2">{description}</Typography>
                <Button onClick={() => setOpen(true)} variant="contained" color="primary">View More</Button>
                <Button onClick={() => buy({variables: {id: item._id}})} variant="contained"
                        color="primary">Buy</Button>
            </CardContent>
            <Modal open={open} onClose={() => setOpen(false)}>
                <FullCard item={item}/>
            </Modal>
        </Card>
    );
};

export default ListingCard;
