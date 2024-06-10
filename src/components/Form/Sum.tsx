import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import { InputAdornment } from "@mui/material";

interface IProps {
    title: string;
    amount: number | string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SumForm: React.FC<IProps> = ({ title, amount, handleChange }) => {
    return (
        <ListItem>
            <ListItemText primary={title}/>
            <TextField
                sx={{
                    input: {
                        textAlign: "end",
                    },
                }}
                variant="standard"
                value={amount}
                InputProps={{
                    endAdornment: (
                        <InputAdornment
                            sx={{ paddingLeft: 1 }}
                            position="end"
                        >
                            ₽
                        </InputAdornment>
                    ),
                    disableUnderline: true,
                }}
                onChange={handleChange}
            />
        </ListItem>
    );
};

export default SumForm;
