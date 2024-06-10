import Button, { ButtonProps } from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";

type IProps = {
    onClick: (event: React.MouseEvent) => void;
    children: React.ReactNode;
} & Pick<ButtonProps, "color">;

const ButtonForm: React.FC<IProps> = ({ onClick, children, color }) => {
    return (
        <ListItem>
            <Button
                onClick={onClick}
                fullWidth
                variant="contained"
                color={color}
            >
                {children}
            </Button>
        </ListItem>
    );
};

export default ButtonForm;
