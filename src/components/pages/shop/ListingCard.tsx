import {Card, CardContent, Typography, Button, Modal} from '@mui/material';
import {FC, useState} from "react";
import FullCard from "./FullCard.tsx";
import {Item} from "./ShopPage.tsx";

interface ListingCardProps {
    item: Item
}

const ListingCard: FC<ListingCardProps> = ({item}) => {
    const {name, category, description} = item
    const [open, setOpen] = useState(false);

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">{name}</Typography>
                <Typography color="textSecondary">{category}</Typography>
                <Typography variant="body2">{description}</Typography>
                <Button onClick={() => setOpen(true)} variant="contained" color="primary">View More</Button>
            </CardContent>
            <Modal open={open} onClose={() => setOpen(false)}>
                <FullCard item={item}/>
            </Modal>
        </Card>
    );
};

export default ListingCard;
