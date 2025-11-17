import { useNavigate } from "react-router-dom";
import errorImage from "../assets/404_image.png";

export default function Display404() {
    const navigate = useNavigate();
    return (
        <div
            style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "5%" }}
        >
            <img src={errorImage} style={{ width: "40%" }} />
            <a style={{ fontSize: "small", fontWeight: "bold" }} onClick={() => navigate("/vacations")}>
                GO TO THE MAIN PAGE!!!
            </a>
        </div>
    );
}
