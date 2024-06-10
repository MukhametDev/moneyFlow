import { useCallback, useEffect, useState } from "react";
import TransactionForm from "../components/Transactions/Form/Form";
import { TransactionType } from "../type";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import TransactionItems from "../components/Transactions/Items";
import DialogForm from "../components/Form/Dialog";
import ButtonAdd from "../components/ButtonAdd";
import MenuAppBar from "../components/AppBar/Menu";
import PanelGeneral from "../components/Transactions/General/Panel";
import { observer } from "mobx-react-lite";
import { tranStore } from "../store/transaction";
import { groupBillStore } from "../store/groupBill";
import PeriodAppBar from "../components/AppBar/Period";

const TransactionPage = observer(() => {
    const { fetchGroupBills } = groupBillStore;

    const {
        transaction,
        setTransactionType: setType,
        resetTransaction,
        updateGeneral,
    } = tranStore;

    const tranType: TransactionType = transaction.type;

    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

    // ------------- General -------------

    const handleUpdateGeneral = useCallback(() => {
        updateGeneral();
        fetchGroupBills();
    }, [updateGeneral, fetchGroupBills]);

    // ------------- Transaction -------------

    const handleClickTranType = useCallback(
        (event: React.MouseEvent<HTMLElement>, tranType: TransactionType) => {
            setType(tranType);
        },
        [setType]
    );

    const handleOpenForm = useCallback(() => {
        setIsFormOpen((prevState) => {
            if (prevState) {
                resetTransaction();
            }

            return !prevState;
        });
    }, [resetTransaction]);

    useEffect(() => {
        // handleUpdateGeneral();
    }, [handleUpdateGeneral]);

    const DialogButtons = () => {
        return (
            <ToggleButtonGroup
                exclusive
                value={tranType}
                onChange={handleClickTranType}
            >
                <ToggleButton value={TransactionType.Income}>
                    Доход
                </ToggleButton>
                <ToggleButton value={TransactionType.Expense}>
                    Расход
                </ToggleButton>
            </ToggleButtonGroup>
        );
    };

    return (
        <Box width={"100%"} sx={{ backgroundColor: "#f0f0f0" }}>
            <MenuAppBar>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <ButtonAdd handleClick={handleOpenForm} />
                    <PeriodAppBar />
                </Box>
            </MenuAppBar>
            <PanelGeneral />
            <TransactionItems handleOpenForm={handleOpenForm} />
            <DialogForm
                title={<DialogButtons />}
                isFormOpen={isFormOpen}
                handleOpenForm={handleOpenForm}
            >
                <TransactionForm handleOpenForm={handleOpenForm} />
            </DialogForm>
        </Box>
    );
});

export default TransactionPage;
