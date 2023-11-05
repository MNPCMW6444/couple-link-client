import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const HomePage = () => {

    const nav = useNavigate()

    useEffect(() => {
        nav("/chat")
    }, [nav])

    return "home"
};

export default HomePage