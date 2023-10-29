import {Grid, Typography} from "@mui/material";
import {useContext, useState} from "react";
import ContactsContext from "../../../context/ContactsContext.tsx";
import Button from "@mui/material/Button";
import {Add} from "@mui/icons-material";
import {gql, useMutation} from "@apollo/client";
import TextField from "@mui/material/TextField";

const HomePage = () => {

    const {contacts, invitations, sentInvitations} = useContext(ContactsContext);

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

        <Grid item>
            <br/>
            <br/>
            <Typography variant="h4">contacts:</Typography>
            <br/>
        </Grid>


        {contacts.map((contact) =>
            <Grid item key={contact}>
                <Typography variant="h5">{contact}</Typography>
            </Grid>
        )
        }


        <Grid item>
            <br/>
            <br/>
            <Typography variant="h4">invitations:</Typography>
            <br/>
        </Grid>

        {invitations.map((invitation) =>
            <Grid item key={invitation}>
                <Typography variant="h5">{invitation}</Typography>
            </Grid>
        )
        }


        <Grid item>
            <br/>
            <br/>
            <Typography variant="h4">sentInvitations:</Typography>
            <br/>
        </Grid>

        {sentInvitations.map((sentInvitation) =>
            <Grid item key={sentInvitation}>
                <Typography variant="h5">{sentInvitation}</Typography>
            </Grid>
        )
        }
    </Grid>
};

export default HomePage