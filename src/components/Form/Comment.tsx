import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";

interface IProps {
    value: string;
    title: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CommentForm: React.FC<IProps> = ({ value, title, handleChange }) => {
    return (
        <ListItem>
            <TextField
                value={value}
                variant="standard"
                InputProps={{
                    disableUnderline: true,
                }}
                sx={{ width: "100%" }}
                onChange={handleChange}
                placeholder={title}
            />
        </ListItem>
    );
};
export default CommentForm;
