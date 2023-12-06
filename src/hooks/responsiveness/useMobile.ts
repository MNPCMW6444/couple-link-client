import {useMediaQuery} from "@mui/material";

export default () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const isMobileOrTabl = useMediaQuery('(max-width:900px)');
    return {isMobile, isMobileOrTabl}
}