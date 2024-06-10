import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { ITransaction, TransactionType } from "../../type";

type IProps = {
    transaction: ITransaction;
    handleClickTransaction: (transaction: ITransaction) => void;
};

const TransactionItem: React.FC<IProps> = ({
    transaction,
    handleClickTransaction,
}) => {
    const isExpense = transaction.type === TransactionType.Expense;
    const displayAmount = `${isExpense ? "-" : "+"} ${transaction.amount} ₽`;

    return (
        <ListItemButton
            sx={{ padding: 0, minHeight: 50 }}
            onClick={() => handleClickTransaction(transaction)}
        >
            <ListItemText primary={`${transaction.category}`} />
            <ListItemText
                sx={{ textAlign: "right" }}
                primary={
                    <Box
                        color={isExpense ? "text.primary" : "success.main"}
                        fontWeight="fontWeightMedium"
                    >
                        {displayAmount}
                    </Box>
                }
            />
        </ListItemButton>
    );
};

export default TransactionItem;
