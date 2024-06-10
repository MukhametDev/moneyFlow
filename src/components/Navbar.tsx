import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import Box from "@mui/material/Box";
import MenuAppBar from "./AppBar/Menu";
import React, { useCallback } from "react";
import { NavLink } from "react-router-dom";
import { exportData, importData } from "../API/Manager";
import { groupBillStore } from "../store/groupBill";
import { observer } from "mobx-react-lite";
import ListIcon from "@mui/icons-material/FormatListBulletedRounded";
import SendIcon from "@mui/icons-material/SendToMobileRounded";
import InstallIcon from "@mui/icons-material/InstallMobileRounded";
import PieChartIcon from "@mui/icons-material/PieChartRounded";
import ArticleIcon from "@mui/icons-material/ArticleRounded";

interface IProps {
    children?: React.ReactNode;
}

const navItems = [
    {
        path: "/transactions",
        icon: <ListIcon />,
        text: "Операции",
    },
    {
        path: "/reports",
        icon: <PieChartIcon />,
        text: "Отчёт",
    },
    { path: "/plans", icon: <ArticleIcon />, text: "План" },
];

const Navbar: React.FC<IProps> = observer(({ children }) => {
    const drawerWidth = "15%";

    const handleImport = useCallback(async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.onchange = (event: Event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target?.result as string);
                        importData(data).then(() =>
                            groupBillStore.fetchGroupBills()
                        );
                    } catch (error) {
                        console.error("Failed to parse JSON:", error);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }, []);

    return (
        <Box sx={{ display: "flex" }}>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
                anchor="left"
                variant="permanent"
                PaperProps={{
                    sx: {
                        backgroundColor: "#dcdcdc",
                        borderRight: "0px",
                    },
                }}
            >
                <MenuAppBar />
                <List>
                    {navItems.map((item) => (
                        <ListItem disablePadding key={item.path}>
                            <ListItemButton
                                component={NavLink}
                                to={item.path}
                                sx={{
                                    "&.active": {
                                        backgroundColor: "#bfbfbf",
                                    },
                                }}
                            >
                                {item.icon}
                                &nbsp;
                                <ListItemText primary={`${item.text}`} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    <ListItem />
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleImport}>
                            <InstallIcon />
                            <ListItemText primary="&nbsp;Импорт" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={exportData}>
                            <SendIcon />
                            <ListItemText primary="&nbsp;Экспорт" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            {children}
        </Box>
    );
});

export default Navbar;
