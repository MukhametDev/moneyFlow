import React, { useContext, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "./../../index";
import { IData } from "../../type";

interface IRegistrationForm {
    onSwitchToLogin: () => void;
}

const RegistrationForm: React.FC<IRegistrationForm> = observer(
    ({ onSwitchToLogin }) => {
        const [message, setMessage] = useState<string | null>(null);
        const { store } = useContext(Context);
        const {
            control,
            reset,
            handleSubmit,
            formState: { errors },
        } = useForm<IData>();
        const navigate = useNavigate();

        const onSubmit = async (data: IData) => {
            store.register(data.username, data.email, data.password);
            reset();
            onSwitchToLogin();
            navigate("/");
        };

        const getHelperText = (
            error:
                | FieldError
                | Merge<FieldError, FieldErrorsImpl<any>>
                | undefined
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
                    Регистрация
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <Controller
                        name="username"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Username is required" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Username"
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
                        rules={{
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Email"
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
                                label="Password"
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
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            "&:hover": { color: "purple" },
                        }}
                    >
                        <Button onClick={onSwitchToLogin}>
                            Уже зарегистрированы?
                        </Button>
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Зарегистрироваться
                    </Button>
                </Box>
                {message && (
                    <Typography
                        variant="body1"
                        color="textSecondary"
                        align="center"
                    >
                        {message}
                    </Typography>
                )}
            </Container>
        );
    }
);

export default RegistrationForm;
