import { useCallback, useState } from "react";
import CommentForm from "../Form/Comment";
import SumForm from "../Form/Sum";
import Divider from "@mui/material/Divider";
import ButtonForm from "../Form/Button";
import { IBill, IGroupBill } from "../../type";
import GroupBillSelector from "../Form/GroupBillSelector";

interface IProps {
    bill: IBill;
    groupBills: IGroupBill[];
    handleAddBill: (bill: IBill) => void;
    handleUpdateBill: (id: string, bill: IBill) => void;
    handleOpenForm: () => void;
}

const BillForm: React.FC<IProps> = ({
    bill,
    groupBills,
    handleAddBill,
    handleUpdateBill,
    handleOpenForm,
}) => {
    const [groupBillId, setGroupBillId] = useState<string>(bill.group_bill_id);
    const [name, setName] = useState<string>(bill.name);
    const [balance, setBalance] = useState<number>(bill.balance);

    const handleNameChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
        },
        []
    );

    const handleBalanceChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setBalance(parseFloat(event.target.value));
        },
        []
    );

    const handleSelectGroup = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setGroupBillId(value);
        },
        []
    );

    const handleSubmit = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();
            const id = bill.id;
            const group_bill_id = groupBillId;
            const newBill: IBill = {
                id,
                group_bill_id,
                name,
                balance,
            };

            if (id === "") {
                handleAddBill(newBill);
            } else {
                handleUpdateBill(id, newBill);
            }

            handleOpenForm();
        },
        [
            bill.id,
            groupBillId,
            name,
            balance,
            handleOpenForm,
            handleAddBill,
            handleUpdateBill,
        ]
    );

    return (
        <>
            <Divider component="li" />

            <CommentForm
                title="Название"
                value={name}
                handleChange={handleNameChange}
            />

            <Divider component="li" />

            <SumForm
                title="Начальный баланс"
                amount={balance}
                handleChange={handleBalanceChange}
            />

            <Divider component="li" />

            <GroupBillSelector
                groupBills={groupBills}
                groupBillId={groupBillId}
                handleSelectGroup={handleSelectGroup}
            />

            <Divider component="li" />

            <ButtonForm color="primary" onClick={handleSubmit}>
                Сохранить счет
            </ButtonForm>
        </>
    );
};

export default BillForm;
