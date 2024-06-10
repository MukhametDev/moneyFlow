import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/AddCircleOutline";
import React from "react";

interface IProps {
    handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ButtonAdd: React.FC<IProps> = ({ handleClick }) => {
    return (
        <IconButton onClick={handleClick}>
            <AddIcon />
        </IconButton>
    );
};

export default ButtonAdd;
