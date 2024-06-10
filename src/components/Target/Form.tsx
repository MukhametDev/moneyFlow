import { Divider } from "@mui/material";
import CommentForm from "../Form/Comment";
import { useCallback, useEffect, useState } from "react";
import SumForm from "../Form/Sum";
import { groupBillStore } from "../../store/groupBill";
import GroupBillSelector from "../Form/GroupBillSelector";
import DateForm from "../Transactions/Form/Date";
import dayjs, { Dayjs } from "dayjs";
import ButtonForm from "../Form/Button";
import { ITarget } from "../../type";
import { targetStore } from "../../store/target";
import { observer } from "mobx-react-lite";
import { updateTarget } from "../../API/Manager";

interface IProps {
    handleOpenForm: () => void;
}

const TargetForm: React.FC<IProps> = observer(({ handleOpenForm }) => {
    const { groupBills, fetchGroupBills } = groupBillStore;
    const { addTarget, target } = targetStore;

    const [date, setDate] = useState<Dayjs>(dayjs(target.date));
    const [groupBillId, setGroupBillId] = useState<string>(target.groupBillId);
    const [name, setName] = useState<string>(target.name);
    const [balance, setBalance] = useState<number>(target.target);

    const handleNameChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
        },
        []
    );

    const handleBalanceChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseFloat(event.target.value);
            setBalance(value);
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
            const id = target.id;

            const newTarget: ITarget = {
                id: id,
                groupBillId: groupBillId,
                name: name,
                balance: 0,
                target: balance,
                date: date,
            };

            if (id === "") {
                addTarget(newTarget);
            } else {
                updateTarget(id, newTarget);
            }

            handleOpenForm();
        },
        [target.id, groupBillId, name, balance, date, handleOpenForm, addTarget]
    );

    useEffect(() => {
        fetchGroupBills();
    }, [fetchGroupBills]);

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
                title="Сумма"
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

            <DateForm date={date} setDate={setDate} />

            <Divider component="li" />

            <ButtonForm color="primary" onClick={handleSubmit}>
                Сохранить счет
            </ButtonForm>
        </>
    );
});

export default TargetForm;
