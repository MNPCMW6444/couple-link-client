import {useQuery, gql} from '@apollo/client';
import {Container, Grid, Typography, CircularProgress} from '@mui/material';
import ListingCard from './ListingCard'; // Import the ListingCard component

// Define the GraphQL query
const GET_PUBLIC_ROLES = gql`
  query GetPublicRoles {
      getPublicRoles {
        creatorId
        name
        publicName
        role
        setId
        attributes
        description
        aiMessage
        visibility
        _id
        createdAt
        updatedAt
      }
    }
`;

const ShopPage = () => {
    // Execute the query
    const {loading, error, data} = useQuery(GET_PUBLIC_ROLES);

    if (loading) return <CircularProgress/>; // Show a loading spinner while the query is in progress
    if (error) return <p>Error loading listings. = {JSON.stringify(error)}</p>; // Show an error message if the query fails

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Marketplace Listings
            </Typography>
            <Grid container spacing={3}>
                {data.getPublicRoles.map((listing: any) => (
                    <Grid item xs={12} sm={6} md={4} key={listing._id}>
                        <ListingCard item={listing}/>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ShopPage;
