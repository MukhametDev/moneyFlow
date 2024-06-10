import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

interface IProps {
    title: string | React.ReactNode;
    isFormOpen: boolean;
    handleOpenForm: () => void;
    children: React.ReactNode;
}

const DialogForm: React.FC<IProps> = ({
    title,
    isFormOpen,
    handleOpenForm,
    children,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Проверка разрешения экрана

    return (
        <Dialog open={isFormOpen} onClose={handleOpenForm}>
            <DialogTitle
                sx={{
                    backgroundColor: "#dedede",
                    textAlign: "center",
                    p: 1,
                }}
            >
                {title}
            </DialogTitle>
            <IconButton
                onClick={handleOpenForm}
                sx={{ position: "absolute", top: 8, right: 8 }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent sx={{ p: 2 }}>
                <List
                    sx={{
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        borderRadius: theme.shape.borderRadius,
                        minWidth: isMobile ? "100%" : 400,
                        padding: 0,
                        "& .MuiListItem-root": {
                            minHeight: "60px",
                            padding: 0,
                        },
                        "& .MuiListItemButton-root": {
                            minHeight: "60px",
                            padding: 0,
                        },
                    }}
                >
                    {children}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default DialogForm;
