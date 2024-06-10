import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

interface IProps {
    title: string;
    data: string | number;
    colorData: string;
}

const ItemGeneral: React.FC<IProps> = ({ title, data, colorData }) => {
    const isNegative = colorData === "error.main";
    const displayData = `${isNegative ? "-" : "+"} ${data}`;

    return (
        <Grid sx={{ textAlign: "end" }} item xs={6}>
            <Paper variant="outlined" sx={{ p: 2, backgroundColor: "#f0f0f0" }}>
                <Typography
                    fontWeight="fontWeightMedium"
                    variant="subtitle1"
                    color="textPrimary"
                >
                    {title}
                </Typography>
                <Typography variant="h5" color={colorData}>
                    {displayData}
                </Typography>
            </Paper>
        </Grid>
    );
};

export default ItemGeneral;
