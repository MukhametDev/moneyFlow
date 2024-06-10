import React, { useCallback, useState } from "react";
import { Dayjs } from "dayjs";
import SumForm from "../../Form/Sum";
import CategoryForm from "./Category";
import DateForm from "./Date";
import CommentForm from "../../Form/Comment";
import Divider from "@mui/material/Divider";
import { ITransaction } from "../../../type";
import ButtonForm from "../../Form/Button";
import { billStore } from "../../../store/bill";
import { tranStore } from "../../../store/transaction";
import CustomKeypad from "./Keypad";

interface IProps {
    handleOpenForm: () => void;
}

const TransactionForm: React.FC<IProps> = ({ handleOpenForm }) => {
    const {
        transaction,
        addTransaction,
        updateTransaction,
        deleteTransaction,
    } = tranStore;

    const id = transaction.id;
    const validCharacters = /^[0-9+\-*/,.]*$/;

    const [amount, setAmount] = useState<string>(transaction.amount.toString());
    const [date, setDate] = useState<Dayjs>(transaction.date);
    const [comment, setComment] = useState<string>(transaction.comment);
    const [selectedCategory, setSelectedCategory] = useState<string>(
        transaction.category
    );

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (validCharacters.test(newValue)) {
            setAmount(newValue);
        }
    };

    const handleCategoryChange = useCallback((category: string) => {
        setSelectedCategory(category);
    }, []);

    const handleCommentChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setComment(event.target.value);
        },
        []
    );

    const handleDelete = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();
            deleteTransaction(id);
            handleOpenForm();
        },
        [deleteTransaction, id, handleOpenForm]
    );

    const handleSubmit = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();

            const newTransaction: ITransaction = {
                id: id,
                category: selectedCategory,
                amount: parseFloat(amount),
                comment: comment,
                date: date,
                type: transaction.type,
                billId: billStore.bill.id,
            };

            if (id === "") {
                addTransaction(newTransaction);
            } else {
                updateTransaction(id, newTransaction);
            }

            handleOpenForm();
        },
        [
            id,
            selectedCategory,
            amount,
            comment,
            date,
            transaction.type,
            handleOpenForm,
            addTransaction,
            updateTransaction,
        ]
    );

    return (
        <>
            <CustomKeypad amount={amount} setAmount={setAmount} />

            <Divider component="li" />

            <SumForm
                title="Сумма"
                amount={amount}
                handleChange={handleAmountChange}
            />

            <Divider component="li" />

            <CategoryForm
                category={selectedCategory}
                handleCategorySelect={handleCategoryChange}
            />

            <Divider component="li" />

            <DateForm date={date} setDate={setDate} />

            <Divider component="li" />

            <CommentForm
                value={comment}
                title="Примечание"
                handleChange={handleCommentChange}
            />

            <Divider component="li" />

            <ButtonForm onClick={handleSubmit} color="primary">
                Сохранить операцию
            </ButtonForm>

            {id !== "" && (
                <ButtonForm onClick={handleDelete} color="error">
                    Удалить операцию
                </ButtonForm>
            )}
        </>
    );
};

export default TransactionForm;
