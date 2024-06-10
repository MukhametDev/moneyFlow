import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useCallback, useState } from "react";
import { tranStore } from "../../../store/transaction";

interface IProps {
    category: string;
    handleCategorySelect: (category: string) => void;
}

const CategoryForm: React.FC<IProps> = ({ category, handleCategorySelect }) => {
    const [open, setOpen] = useState<boolean>(false);
    const { categories } = tranStore;

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleCategoryClick = useCallback(
        (category: string) => {
            handleClose();
            handleCategorySelect(category);
        },
        [handleClose, handleCategorySelect]
    );

    return (
        <>
            <ListItem>
                <ListItemButton onClick={() => setOpen(true)}>
                    <ListItemText primary="Категория" />
                    <ListItemText
                        sx={{ textAlign: "end" }}
                        primary={category}
                    />
                </ListItemButton>
            </ListItem>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ textAlign: "center" }}>
                    Категория
                </DialogTitle>
                <IconButton
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <List sx={{ minWidth: 400 }}>
                        {categories.map((category) => (
                            <ListItemButton
                                key={category}
                                onClick={() => {
                                    handleCategoryClick(category);
                                }}
                            >
                                <ListItemText primary={category} />
                            </ListItemButton>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CategoryForm;
