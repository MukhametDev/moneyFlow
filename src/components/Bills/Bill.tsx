import ListItemButton from "@mui/material/ListItemButton";
import RemoveIcon from "@mui/icons-material/Remove";
import ListItemText from "@mui/material/ListItemText";
import { IBill } from "../../type";
import { useCallback } from "react";
import { billStore } from "../../store/bill";
import { groupBillStore } from "../../store/groupBill";
import { observer } from "mobx-react-lite";
import { tranStore } from "../../store/transaction";

interface IProps {
    bill: IBill;
}

const Bill: React.FC<IProps> = ({ bill }) => {
    const { getTransactions, updateGeneral, getCategoryChart } = tranStore;

    const handleClick = useCallback(() => {
        billStore.setBill(bill);
        groupBillStore.resetGroupBill();
        getTransactions()
            .then(() => updateGeneral())
            .then(() => getCategoryChart());
    }, [bill, getCategoryChart, getTransactions, updateGeneral]);

    return (
        <ListItemButton
            selected={billStore.bill.id === bill.id}
            sx={{ pl: 4 }}
            onClick={handleClick}
        >
            <RemoveIcon fontSize="small" />
            <ListItemText primary={bill.name} />
            <ListItemText
                sx={{ textAlign: "right" }}
                primary={`${bill.balance} ₽`}
            />
        </ListItemButton>
    );
};

export default observer(Bill);
