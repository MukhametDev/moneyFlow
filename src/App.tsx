import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme } from "./styles/Theme";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { Route, Routes } from "react-router-dom";
import MainPage from "./Pages/Main";
import Navbar from "./components/Navbar";
import ReportPage from "./Pages/Report";
import PlanPage from "./Pages/Plan";
import { CssBaseline } from "@mui/material";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import LoginForm from "./components/LoginForm/LoginForm";
import RegistrationForm from "./components/RegisterForm/RegisterForm";
import { useContext, useEffect, useState } from "react";
import { Context } from "./index";
import { observer } from "mobx-react-lite";
import Loader from "./components/Loader/Loader";
import General from "./Pages/General";

dayjs.locale("ru");

function App() {
    const { store } = useContext(Context);
    const [showLoginForm, setShowLoginForm] = useState(true);
    
    const handleShowLoginForm = () => setShowLoginForm(true);
    const handleShowRegistrationForm = () => setShowLoginForm(false);

    useEffect(() => {
        if (localStorage.getItem("access_token")) {
            store.checkAuth();
        }
    }, []);

    if (store.isLoading) {
        return <Loader />;
    }

   if (!store.isAuthenticated) {
        return (
            <ThemeProvider theme={lightTheme}>
                <CssBaseline />
                {showLoginForm ? (
                    <LoginForm onSwitchToRegister={handleShowRegistrationForm} />
                ) : (
                    <RegistrationForm onSwitchToLogin={handleShowLoginForm} />
                )}
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <Navbar>
                <Routes>
                    <Route path="/" element={<General />}>
                        <Route
                            path="/transactions"
                            element={
                                <PrivateRoute>
                                    <MainPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/reports"
                            element={
                                <PrivateRoute>
                                    <ReportPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/plans"
                            element={
                                <PrivateRoute>
                                    <PlanPage />
                                </PrivateRoute>
                            }
                        />
                    </Route>
                </Routes>
            </Navbar>
        </ThemeProvider>
    );
}

export default observer(App);
