import {
    ChangeEvent,
    FormEvent,
    KeyboardEvent,
    useContext,
    useEffect,
    useState,
} from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import UserContext from "../../context/UserContext";
import {toast} from "react-toastify";
import {gql, useMutation} from "@apollo/client";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import {useLocation} from "react-router-dom";

export interface LablesConstants {
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

export const LABELS: LablesConstants = {
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
    const [buttonLabel, setButtonLabel] = useState<keyof LablesConstants>("IDLE");
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
        if (query.get("code") || "") setPassword(query.get("code") || "");
    }, [query]);

    useEffect(() => {
        if (password && !asked) {
            setAsked(true);
            debugger;
        }
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
        return !(parts.length === 2 && /^0+/.test(parts[1]));

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
        }
    ;

    return (
        <Box width="100%" height="100%" bgcolor="black">
            <Dialog open={true}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <PhoneInput
                        country={'il'}
                        value={email}
                        onChange={setPhoneNumber}
                        containerStyle={{width: '100%'}}
                        inputStyle={{width: '100%'}}
                        placeholder="Enter phone number"
                        enableSearch={true}
                    />

                    {/* Display error if validatePhone fails */}
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
                    />
                    } <Box mt={2}>
                    <Button
                        color="secondary"
                        type="submit"
                        data-testid="login-button"
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit}
                    >
                        {LABELS[buttonLabel].LOGIN}
                    </Button>
                </Box>

                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Login;
