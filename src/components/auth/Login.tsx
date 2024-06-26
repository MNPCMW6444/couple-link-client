import {ChangeEvent, FormEvent, KeyboardEvent, useContext, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import UserContext from "../../context/UserContext";
import {gql, useMutation} from "@apollo/client";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import {useLocation, useNavigate} from "react-router-dom";
import toast from 'react-hot-toast';
import {Grid, Paper, Typography} from "@mui/material";
import img from "../../assets/x.png"
import useMobile from "../../hooks/responsiveness/useMobile.ts";

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
    const [r, setR] = useState<string>("");
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
        if (query.get("r")) setR(query.get("/contacts") || "");
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
                setCountryCode(data.country.toLowerCase());
            })
    }, []);

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit(e as unknown as FormEvent);
        }
    };

    const navigate = useNavigate();

    const validatePhone = (number: string) => {
        const parts = number.split(" ");
        return !(parts?.length === 2 && /^0+/.test(parts[1]));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (asked && password) {
            signin({variables: {phone: email, code: parseInt(password, 10)}}).then(() => {

            }).catch(() => {

            })
            r && navigate(r);
        } else {
            if (validatePhone(email)) {
                signreq({variables: {phone: email}}).then(() => {

                }).catch(() => {

                })
                setAsked(true)
            }
        }
    };

    const {isMobileOrTabl} = useMobile();

    const loginForm = (
        <Grid item container justifyContent="center" alignItems="center" width={isMobileOrTabl ? "100vw" : "30vw"}
              height="100vh" position="fixed" right={0}>
            <Grid item> <Paper style={{padding: 20, maxWidth: 400, margin: '0 auto'}}>
                <Typography variant="h6" textAlign="center">Login</Typography>
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
                    <Typography color="error" style={{fontSize: '0.8em'}}>
                        Invalid phone number
                    </Typography>
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
                        <Grid item>
                            <Button
                                color="primary"
                                variant="outlined"
                                onClick={() => asked ? setAsked(false) : setAsked(true)}
                            >
                                {asked ? "I didn't receive a code" : "I already have a code"}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                color={asked ? "secondary" : "primary"}
                                type="submit"
                                data-testid="login-button"
                                variant="contained"
                                onClick={handleSubmit}
                            >
                                {asked ? LABELS[buttonLabel].LOGIN : "Send me a code"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
            </Grid>
        </Grid>
    );

    return (
        <Grid container>
            {!isMobileOrTabl && <Grid item width="70vw" height="100vh">
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'black',
                    minWidth: '600px',
                    overflow: 'hidden'
                }}>
                    <img
                        src={img}
                        alt="Descriptive Alt Text"
                        style={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'contain'
                        }}
                    />
                </Box>
            </Grid>}
            {loginForm}
        </Grid>
    );
};

export default Login;
