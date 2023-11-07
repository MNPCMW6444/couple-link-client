import {useMediaQuery} from "@mui/material";

export default () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    return {isMobile}
}