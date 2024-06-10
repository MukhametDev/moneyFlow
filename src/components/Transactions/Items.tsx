import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import { ITransaction } from "../../type";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Divider, Grow, Skeleton, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import TransactionItem from "./Item";
import { Dayjs } from "dayjs";
import { tranStore } from "../../store/transaction";
import { observer } from "mobx-react-lite";

type IProps = {
    handleOpenForm: () => void;
};

const isSameDay = (date1: Dayjs, date2: Dayjs) => {
    return (
        date1.format("D") === date2.format("D") &&
        date1.format("M") === date2.format("M")
    );
};

const TransactionItems: React.FC<IProps> = ({ handleOpenForm }) => {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState("");
    const { transactions, setTransaction, getTransactions, isLoading } =
        tranStore;

    const handleClickTransaction = useCallback(
        (transaction: ITransaction) => {
            setTransaction(transaction);
            handleOpenForm();
        },
        [handleOpenForm, setTransaction]
    );

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredTransactions = transactions.filter((transaction) => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
            transaction.comment.toLowerCase().includes(lowerCaseQuery) ||
            transaction.category.toLowerCase().includes(lowerCaseQuery) ||
            transaction.amount.toString().includes(lowerCaseQuery)
        );
    });

    useEffect(() => {
        getTransactions();
    }, [getTransactions]);

    return (
        <Box>
            <TextField
                label="Поиск по расходам"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ paddingLeft: 1, paddingRight: 1 }}
            />
            <List
                sx={{
                    color: theme.palette.text.primary,
                    borderRadius: theme.shape.borderRadius,
                }}
            >
                {isLoading
                    ? Array.from(new Array(5)).map((_, index) => (
                          <Grow
                              in={true}
                              key={index}
                              style={{ transitionDelay: `${index * 100}ms` }}
                          >
                              <Box sx={{ padding: "0px 8px 0px 8px" }}>
                                  <Skeleton variant="text" width={210} />
                                  <Skeleton
                                      variant="rectangular"
                                      height={40}
                                      sx={{ marginBottom: 2 }}
                                  />
                              </Box>
                          </Grow>
                      ))
                    : filteredTransactions.map((transaction, index) => {
                          const prevTransaction =
                              filteredTransactions[index - 1];
                          const showDate =
                              !prevTransaction ||
                              !isSameDay(
                                  prevTransaction.date,
                                  transaction.date
                              );

                          return (
                              <Grow in={true} key={transaction.id}>
                                  <Box sx={{ padding: "0px 8px 0px 8px" }}>
                                      {showDate && (
                                          <>
                                              <ListItemText
                                                  sx={{
                                                      padding:
                                                          "16px 0px 8px 0px",
                                                  }}
                                                  primary={`${transaction.date.format(
                                                      "dddd, D MMM YYYY"
                                                  )} г.`}
                                              />
                                              <Divider component="li" />
                                          </>
                                      )}
                                      <TransactionItem
                                          transaction={transaction}
                                          handleClickTransaction={
                                              handleClickTransaction
                                          }
                                      />
                                      <Divider component="li" />
                                  </Box>
                              </Grow>
                          );
                      })}
            </List>
        </Box>
    );
};

export default observer(TransactionItems);
