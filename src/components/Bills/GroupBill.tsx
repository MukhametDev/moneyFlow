import {
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { IGroupBill } from "../../type";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Bill from "./Bill";
import { billStore } from "../../store/bill";
import { groupBillStore } from "../../store/groupBill";
import { tranStore } from "../../store/transaction";

interface IProps {
    groupBill: IGroupBill;
}

const GroupBillItem: React.FC<IProps> = ({ groupBill }) => {
    const activeGroupBillId = groupBillStore.groupBill.id;
    const { getTransactions, updateGeneral, getCategoryChart } = tranStore;

    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        const savedState = localStorage.getItem(
            `groupBill-${groupBill.id}-open`
        );
        setOpen(savedState ? JSON.parse(savedState) : false);
    }, [groupBill.id]);

    const handleClick = useCallback(async () => {
        groupBillStore.setGroupBill(groupBill);
        billStore.resetBill();
        await getTransactions();
        updateGeneral();
        await getCategoryChart();
    }, [getCategoryChart, getTransactions, groupBill, updateGeneral]);

    const handleCollapse = useCallback(() => {
        setOpen((prevState) => {
            const newState = !prevState;
            localStorage.setItem(
                `groupBill-${groupBill.id}-open`,
                JSON.stringify(newState)
            );
            return newState;
        });
    }, [groupBill.id]);

    return (
        <>
            <ListItem sx={{ p: 0, display: "flex", alignItems: "center" }}>
                <IconButton onClick={handleCollapse}>
                    {open ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
                <ListItemButton
                    sx={{ flexGrow: 1 }}
                    onClick={handleClick}
                    selected={activeGroupBillId === groupBill.id}
                >
                    <ListItemText primary={groupBill.name} />
                </ListItemButton>
            </ListItem>
            <Collapse in={open}>
                <List component="div" disablePadding>
                    {groupBill.bills?.map((bill) => (
                        <Bill key={bill.id} bill={bill} />
                    ))}
                </List>
            </Collapse>
        </>
    );
};

export default GroupBillItem;
