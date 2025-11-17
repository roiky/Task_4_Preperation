import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Display404 from "./components/404";
import AddLecturer from "./pages/AddLecturer";
import LecturersTable from "./pages/LecturersTable";

export default function App() {
    return (
        <div className="app">
            <Header />
            <main className="container">
                <Routes>
                    <Route path="/" element={<AddLecturer />} />
                    <Route path="/lecturers" element={<LecturersTable />} />
                    <Route path="*" element={<Display404 />} />
                </Routes>
            </main>
        </div>
    );
}
