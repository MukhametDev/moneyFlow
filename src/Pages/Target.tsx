import {
    Box,
    LinearProgress,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import React, { useCallback, useEffect } from "react";
import MenuAppBar from "../components/AppBar/Menu";
import ButtonAdd from "../components/ButtonAdd";
import DialogForm from "../components/Form/Dialog";
import TargetForm from "../components/Target/Form";
import { targetStore } from "../store/target";
import { observer } from "mobx-react-lite";
import TrackIcon from "@mui/icons-material/TrackChangesRounded";
import { ITarget } from "../type";

const TargetPage = () => {
    const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false);
    const { targets, getTargets, setTarget } = targetStore;

    const handleOpenForm = useCallback(() => {
        setIsFormOpen((prevState) => !prevState);
    }, []);

    const handleClickTransaction = useCallback(
        (target: ITarget) => {
            setTarget(target);
            handleOpenForm();
        },
        [handleOpenForm, setTarget]
    );

    useEffect(() => {
        getTargets();
    }, [getTargets]);

    return (
        <Box width={"100%"} sx={{ backgroundColor: "#f0f0f0" }}>
            <MenuAppBar>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography p={1} variant="h6">
                        Цели
                    </Typography>
                    <ButtonAdd handleClick={handleOpenForm} />
                </Box>
            </MenuAppBar>
            {targets.map((target) => {
                const progress = Math.min(
                    (target.balance / target.target) * 100,
                    100
                );

                return (
                    <ListItemButton
                        sx={{ padding: 0, minHeight: 50, m: 1 }}
                        onClick={() => handleClickTransaction(target)}
                        key={target.id}
                    >
                        <TrackIcon fontSize="large" sx={{ m: 1 }} />
                        <ListItemText
                            primary={
                                <Box>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Typography variant="h5">
                                            {target.name}
                                        </Typography>
                                        <Typography variant="h5">
                                            {target.target + " ₽"}
                                        </Typography>
                                    </Box>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Typography variant="h6">
                                            {target.balance + " ₽"}
                                        </Typography>
                                        <Typography variant="h6">
                                            {target.balance > target.target
                                                ? "Цель достигнута 🎉"
                                                : Math.abs(
                                                      target.balance -
                                                          target.target
                                                  ) + " ₽"}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ width: "100%", mr: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={progress}
                                        />
                                    </Box>
                                </Box>
                            }
                        />
                    </ListItemButton>
                );
            })}

            <DialogForm
                title={"Цель"}
                isFormOpen={isFormOpen}
                handleOpenForm={handleOpenForm}
            >
                <TargetForm handleOpenForm={handleOpenForm} />
            </DialogForm>
        </Box>
    );
};

export default observer(TargetPage);
