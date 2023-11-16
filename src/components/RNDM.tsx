import {Button, ListItem} from "@mui/material";
import {useNavigate} from "react-router-dom";
import useMobile from "../hooks/responsiveness/useMobile.ts";
import {Dispatch, SetStateAction} from "react";

interface RNDMProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

const RNDM = ({setOpen}: RNDMProps) => {
    const navigate = useNavigate();
    const isMobile = useMobile()

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) setOpen(false);
    };


    return <>
        <ListItem>
            <Button
                variant="contained"
                sx={{width: "100%"}}
                onClick={() => handleNavigation("/sets")}
            >
                Sets
            </Button>
        </ListItem>
        <ListItem>
            <Button
                variant="contained"
                sx={{width: "100%"}}
                onClick={() => handleNavigation("/roles")}
            >
                Manage
            </Button>
        </ListItem>
    </>
}

export default RNDM