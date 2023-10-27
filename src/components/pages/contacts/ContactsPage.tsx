import {Grid, Typography} from "@mui/material";
import {useContext, useState} from "react";
import ContactsContext from "../../../context/ContactsContext.tsx";
import Button from "@mui/material/Button";
import {Add} from "@mui/icons-material";
import {gql, useMutation} from "@apollo/client";
import TextField from "@mui/material/TextField";

const HomePage = () => {

    const {contacts} = useContext(ContactsContext);

    const [invite, setInvite] = useState(false);
    const [phone, setPhone] = useState("");

    const [doInvite] = useMutation(gql`
        mutation Mutation($contactPhone: String!) {
          newpair(contactPhone: $contactPhone)
        }
    `)

    const handleInvite = () => {
        doInvite({variables: {contactPhone: phone}});
        setInvite(false);
    }

    return <Grid container alignItems="center" direction="column">
        <Grid item>
            <Typography variant="h1">Contacts</Typography>
        </Grid>
        {!invite ? <Grid item>
                <Button onClick={() => setInvite(true)}><Add/> Invite New</Button>
            </Grid> :
            <>
                <Grid item>
                    <TextField value={phone} onChange={(e) => setPhone(e.target.value)}></TextField>
                </Grid>
                <Grid item>
                    <Button onClick={handleInvite}>Send</Button>
                </Grid>
                <Grid item>
                    <Button onClick={() => setInvite(false)}>Cancel</Button>
                </Grid>
            </>
        }
        {contacts.map((contact) =>
            <Grid item key={contact}>
                <Typography variant="h5">{contact}</Typography>
            </Grid>
        )
        }
    </Grid>
};

export default HomePage