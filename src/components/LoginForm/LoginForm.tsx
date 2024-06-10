import React, { useContext } from "react";
import {
    useForm,
    Controller,
    FieldError,
    Merge,
    FieldErrorsImpl,
} from "react-hook-form";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { observer } from "mobx-react";
import authStore from "./../../store/authStore";
import axios from "axios";
import { Context } from "./../../index";
import { Link, useNavigate } from "react-router-dom";
import { IData } from "../../type";

interface ILoginForm {
    onSwitchToRegister: () => void;
}

const LoginForm: React.FC<ILoginForm> = observer(({ onSwitchToRegister }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IData>();
    const navigate = useNavigate();
    const { store } = useContext(Context);

    const onSubmit = async (data: IData) => {
        store.login(data.username, data.email, data.password);
        navigate("/transactions");
    };

    const getHelperText = (
        error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
    ): string | undefined => {
        if (error) {
            if (typeof error.message === "string") {
                return error.message;
            }
        }
        return undefined;
    };
    return (
        <Container
            maxWidth="sm"
            sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Войти
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Controller
                    name="username"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Username is required" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Введите имя"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            error={!!errors.username}
                            helperText={getHelperText(errors.username)}
                        />
                    )}
                />
                <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Email is required" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Введите email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            error={!!errors.email}
                            helperText={getHelperText(errors.email)}
                        />
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Password is required" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Введите пароль"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            error={!!errors.password}
                            helperText={getHelperText(errors.password)}
                        />
                    )}
                />
                <Box
                    sx={{
                        textAlign: "right",
                        paddingY: "5px",
                        "&:hover": {
                            color: "purple",
                        },
                    }}
                >
                    <Button onClick={onSwitchToRegister}>Нет аккаунта?</Button>
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Войти
                </Button>
            </Box>
        </Container>
    );
});

export default LoginForm;
