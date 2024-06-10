import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import TargetPage from "./Target";

const PlanPage = observer(() => {
    return (
        <Box
            sx={{ backgroundColor: "#f0f0f0" }}
            display={"flex"}
            width={"100%"}
            height={"100vh"}
        >
            <TargetPage />
        </Box>
    );
});

export default PlanPage;
