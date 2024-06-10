import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    List,
} from "@mui/material";
import DensityIcon from "@mui/icons-material/DensityMediumRounded";
import { IBill, IGroupBill } from "../type";
import { createBill, createGroupBill, updateBill } from "../API/Manager";
import GroupBillItem from "../components/Bills/GroupBill";
import DialogForm from "../components/Form/Dialog";
import GroupBillForm from "../components/Bills/GroupForm";
import ButtonAdd from "../components/ButtonAdd";
import BillForm from "../components/Bills/BillForm";
import MenuAppBar from "../components/AppBar/Menu";
import { billStore } from "../store/bill";
import { groupBillStore } from "../store/groupBill";

const emptyBill: IBill = {
    id: "",
    group_bill_id: "",
    name: "",
    balance: 0,
};

const BillPage: React.FC = () => {
    const { groupBills, fetchGroupBills } = groupBillStore;

    const [bill, setBill] = useState<IBill>(emptyBill);
    const [openBillForm, setOpenBillForm] = useState<boolean>(false);
    const [openGroupForm, setOpenGroupForm] = useState<boolean>(false);
    const [anchorE1, setAnchorE1] = useState<null | HTMLElement>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const open = Boolean(anchorE1);

    // ------------- Group Bill -------------

    const handleOpenGroupForm = useCallback(() => {
        setAnchorE1(null);
        setOpenGroupForm((prevState: boolean) => !prevState);
    }, []);

    const handleAddGroup = useCallback(
        async (groupBill: IGroupBill) => {
            try {
                await createGroupBill(groupBill);
                fetchGroupBills();
            } catch (error) {
                setErrorMessage("Failed to create group bill");
            }
        },
        [fetchGroupBills]
    );

    // ------------- Bill -------------

    const handleOpenBillForm = useCallback(() => {
        setAnchorE1(null);
        setOpenBillForm((prevState: boolean) => !prevState);
    }, []);

    const handleAddBill = useCallback(
        async (bill: IBill) => {
            try {
                await createBill(bill);
                fetchGroupBills();
            } catch (error) {
                setErrorMessage("Failed to create bill");
            }
        },
        [fetchGroupBills]
    );

    const handleUpdateBill = useCallback(
        async (id: string, bill: IBill) => {
            try {
                await updateBill(id, bill);
                fetchGroupBills();
            } catch (error) {
                setErrorMessage("Failed to update bill");
            }
        },
        [fetchGroupBills]
    );

    // ------------- ---- -------------

    const handleClickAdd = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorE1(event.currentTarget);
        },
        []
    );

    const handleClickEdit = useCallback(() => {
        const newBill = billStore.bill;
        setBill(newBill);
        handleOpenBillForm();
    }, [handleOpenBillForm]);

    const handleCloseMenu = useCallback(() => {
        setAnchorE1(null);
    }, []);

    useEffect(() => {
        fetchGroupBills().catch((error) =>
            setErrorMessage("Failed to fetch group bills")
        );
    }, [fetchGroupBills]);

    return (
        <Box width={"33%"} sx={{ backgroundColor: "#eaeaec" }}>
            <MenuAppBar>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <ButtonAdd handleClick={handleClickAdd} />
                    <Typography>Счет</Typography>
                    <IconButton
                        disabled={billStore.bill.id === ""}
                        onClick={handleClickEdit}
                    >
                        <DensityIcon />
                    </IconButton>
                </Box>
            </MenuAppBar>
            {errorMessage && (
                <Typography color="error" align="center">
                    {errorMessage}
                </Typography>
            )}
            <List component="nav">
                {groupBills &&
                    groupBills.map((groupBill) => {
                        return (
                            <GroupBillItem
                                key={groupBill.id}
                                groupBill={groupBill}
                            />
                        );
                    })}
            </List>
            <Menu anchorEl={anchorE1} open={open} onClose={handleCloseMenu}>
                <MenuItem onClick={handleOpenGroupForm}>
                    Создать группу счетов
                </MenuItem>
                <MenuItem onClick={handleOpenBillForm}>Создать счет</MenuItem>
            </Menu>
            <DialogForm
                title="Группа счетов"
                isFormOpen={openGroupForm}
                handleOpenForm={handleOpenGroupForm}
            >
                <GroupBillForm
                    handleAddGroup={handleAddGroup}
                    handleOpenForm={handleOpenGroupForm}
                />
            </DialogForm>
            <DialogForm
                title="Счет"
                isFormOpen={openBillForm}
                handleOpenForm={handleOpenBillForm}
            >
                <BillForm
                    bill={bill}
                    groupBills={groupBills}
                    handleAddBill={handleAddBill}
                    handleUpdateBill={handleUpdateBill}
                    handleOpenForm={handleOpenBillForm}
                />
            </DialogForm>
        </Box>
    );
};

export default observer(BillPage);
