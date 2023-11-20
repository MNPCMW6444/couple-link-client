import {ChangeEvent, FormEvent, KeyboardEvent, useContext, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import UserContext from "../../context/UserContext";
import {gql, useMutation} from "@apollo/client";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import {useLocation} from "react-router-dom";
import toast, {Toaster} from 'react-hot-toast';
import {Grid} from "@mui/material";

export interface LabelsConstants {
    IDLE: {
        LOGIN: string;
        REGISTER: string;
        RESET: string;
    };
    DOING: {
        LOGIN: string;
        REGISTER: string;
        RESET: string;
    };
}

export const LABELS: LabelsConstants = {
    IDLE: {LOGIN: "Login", REGISTER: "Register", RESET: "Reset"},
    DOING: {
        LOGIN: "Logging in...",
        REGISTER: "Registering...",
        RESET: "Resetting...",
    },
};

const Login = () => {
    const [email, setPhoneNumber] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [buttonLabel, setButtonLabel] = useState<keyof LabelsConstants>("IDLE");
    const [countryCode, setCountryCode] = useState<string>('il');
    const {refreshUserData} = useContext(UserContext);
    const [asked, setAsked] = useState<boolean>(false);
    const [signin, {data, loading, error}] = useMutation(gql`
        mutation Mutation($code: Int!, $phone: String!) {
            signin(code: $code, phone: $phone)
        }
    `);

    const [signreq] = useMutation(gql`
        mutation Mutation($phone: String!) {
            signreq(phone: $phone)
        }
    `);

    const useQuery = () => new URLSearchParams(useLocation().search);
    let query = useQuery();

    useEffect(() => {
        if (query.get("code")) setPassword(query.get("code") || "");
        if (query.get("phone")) setPhoneNumber(query.get("phone") || "");
    }, [query]);

    useEffect(() => {
        if (password && !asked) setAsked(true);
    }, [password]);

    useEffect(() => {
        if (!loading && !error && data && data.signin) {
            refreshUserData(data.signin);
            setButtonLabel("IDLE");
        } else if (loading) {
            setButtonLabel("DOING");
        } else if (error) {
            toast.error(error.message);
            setButtonLabel("IDLE");
        }
    }, [loading, error, data]);

    useEffect(() => {
        fetch('https://ipinfo.io/?token=e58d29926832f8')
            .then(response => response.json())
            .then(data => {
                console.log(data.country.toLowerCase());
                setCountryCode(data.country);
            })
            .catch(error => {
                console.error("Error fetching IP info:", error);
            });
    }, []);

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit(e as unknown as FormEvent);
        }
    };

    const validatePhone = (number: string) => {
        const parts = number.split(" ");
        return !(parts?.length === 2 && /^0+/.test(parts[1]));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (asked && password) {
            signin({variables: {phone: email, code: parseInt(password, 10)}});
        } else {
            if (validatePhone(email)) {
                signreq({variables: {phone: email}})
                setAsked(true)
            }
        }
    };

    return (
        <Box width="100%" height="100%" bgcolor="black">
            <Toaster/>
            <Dialog open={true}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <PhoneInput
                        country={countryCode}
                        value={email}
                        onChange={setPhoneNumber}
                        containerStyle={{width: '100%'}}
                        inputStyle={{width: '100%'}}
                        placeholder="Enter phone number"
                        enableSearch={true}
                    />

                    {!validatePhone(email) && (
                        <span style={{color: 'red', fontSize: '0.8em'}}>
                            Invalid phone number
                        </span>
                    )}
                    {asked && <TextField
                        margin="dense"
                        data-testid="password"
                        label="6 digit OTP sent by SMS"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={handlePasswordChange}
                        onKeyPress={handleKeyPress}
                    />}
                    <Box mt={2}>
                        <Grid container direction="column" alignItems="center" rowSpacing={2}>
                            {<Grid item><Button
                                color="primary"
                                variant="outlined"
                                onClick={() => asked ? setAsked(false) : setAsked(true)}
                            >
                                {asked ? "I didn't receive a code" : "I already have a code"}
                            </Button>
                            </Grid>}
                            <Grid item> <Button
                                color={asked ? "secondary" : "primary"}
                                type="submit"
                                data-testid="login-button"
                                variant="contained"
                                onClick={handleSubmit}
                            >
                                {asked ? LABELS[buttonLabel].LOGIN : "Send me a code"}
                            </Button></Grid>
                        </Grid>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Login;
