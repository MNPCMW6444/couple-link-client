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
import {useNavigate} from "react-router-dom";
import {gql, useMutation} from "@apollo/client";

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
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [buttonLabel, setButtonLabel] = useState<keyof LablesConstants>("IDLE");
    const {refreshUserData} = useContext(UserContext);
    const [signin, {data, loading, error}] = useMutation(gql`
        mutation Mutation($code: Int!, $phone: String!) {
            signin(code: $code, phone: $phone)
        }
    `);

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

    const validatePhone = (email: string) => {
        const re = /^\+?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
        return re.test(email.toLowerCase());
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        signin({variables: {phone: email, code: parseInt(password, 10)}});
        if (validatePhone(email) && password) {
        }
    };

    return (
        <Box width="100%" height="100%" bgcolor="black">
            <Dialog open={true}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        data-testid="email"
                        margin="dense"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        error={!validatePhone(email)}
                        helperText={!validatePhone(email) ? "Invalid email" : ""}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        data-testid="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <Box mt={2}>
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