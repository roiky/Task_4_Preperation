import { Link, useLocation, useNavigate } from "react-router-dom";
import icon from "../assets/navbar_icon.png";
// import { useAuth } from "../contex/AuthContext";
import { Button } from "@mui/material";

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="brand" onClick={() => {}}>
                <img style={{ width: "2%" }} src={icon}></img>
                <span className="accent">Lecturers Site</span>
            </div>
            <nav className="nav">
                <span>
                    <Button
                        style={{ fontSize: "12px" }}
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => navigate("/lecturers")}
                    >
                        Lecturers Table
                    </Button>

                    <Button
                        style={{ fontSize: "12px", margin: 5 }}
                        size="small"
                        variant="contained"
                        // color="error"
                        onClick={() => navigate("/")}
                    >
                        Add Lecturer
                    </Button>
                </span>
            </nav>
            <div className="actions"></div>
        </header>
    );
}
