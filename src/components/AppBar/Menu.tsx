import { Box } from "@mui/material";

interface IProps {
    children?: React.ReactNode;
}

const MenuAppBar: React.FC<IProps> = ({ children }) => {
    return <Box sx={{ height: "50px" }}>{children}</Box>;
};

export default MenuAppBar;
