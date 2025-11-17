import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Display404 from "./components/404";
import VacationsPage from "./pages/VacationsPage";
import AdminPage from "./pages/AdminPage";
import ChartPage from "./pages/ChartPage";
import { RequireAuth } from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";

export default function App() {
    return (
        <div className="app">
            <Header />
            <main className="container">
                <Routes>
                    <Route path="/" element={<Navigate to="/vacations" replace />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/vacations"
                        element={
                            <RequireAuth>
                                <VacationsPage />
                            </RequireAuth>
                        }
                    />{" "}
                    <Route
                        path="/adminPage"
                        element={
                            <RequireAdmin>
                                <AdminPage />
                            </RequireAdmin>
                        }
                    />
                    <Route
                        path="/chart"
                        element={
                            <RequireAdmin>
                                <ChartPage />
                            </RequireAdmin>
                        }
                    />
                    <Route path="*" element={<Display404 />} />
                </Routes>
            </main>
        </div>
    );
}
