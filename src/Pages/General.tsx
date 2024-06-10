import React from "react";
import ResponsiveAppBar from "../components/AppBarAuth/AppBarAuth";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

interface IPropsGeneral {}

const General: React.FC<IPropsGeneral> = ({}) => {
    return (
        <Box sx={{ flex: "1" }}>
            <div className="">
                <ResponsiveAppBar />
            </div>
            <div className="">
                <Outlet />
            </div>
        </Box>
    );
};

export default General;
