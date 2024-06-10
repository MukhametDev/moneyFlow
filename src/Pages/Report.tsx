import { Box, Collapse } from "@mui/material";
import BillPage from "./Bill";
import { billStore } from "../store/bill";
import { groupBillStore } from "../store/groupBill";
import { observer } from "mobx-react-lite";
import Chart from "./Chart";

const ReportPage = observer(() => {
    const isOpen = Boolean(billStore.bill.id || groupBillStore.groupBill.id);

    return (
        <Box display={"flex"} width={"100%"} height={"100vh"}>
            <BillPage />
            <Box sx={{ backgroundColor: "#f0f0f0", width: "100%" }}>
                <Collapse in={isOpen}>
                    <Chart />
                </Collapse>
            </Box>
        </Box>
    );
});

export default ReportPage;
