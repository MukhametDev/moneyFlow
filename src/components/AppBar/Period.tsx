import { useCallback, useState } from "react";
import { tranStore } from "../../store/transaction";
import { Box, Button, Typography } from "@mui/material";
import DialogForm from "../Form/Dialog";
import dayjs from "dayjs";
import "react-date-range/dist/theme/default.css";
import "react-date-range/dist/styles.css";
import { DateRange } from "react-date-range";
import { ru } from "date-fns/locale";
import type { RangeKeyDict } from "react-date-range";
import ButtonForm from "../Form/Button";

interface IDateRange {
    startDate?: Date;
    endDate?: Date;
    key?: string;
}

const PeriodAppBar = () => {
    const [dateFormOpen, setDateFormOpen] = useState<boolean>(false);

    const { startDate, endDate, setDate } = tranStore;

    const [range, setRange] = useState<IDateRange[]>([
        {
            startDate: startDate.toDate(),
            endDate: endDate.toDate(),
            key: "selection",
        },
    ]);

    const handleSetRange = useCallback(
        (range: RangeKeyDict) => {
            const selection = range.selection;
            if (selection.startDate && selection.endDate) {
                setRange([selection]);

                setDate(dayjs(selection.startDate), dayjs(selection.endDate));
            }
        },
        [setDate]
    );

    const handleOpenDateForm = useCallback(() => {
        setDateFormOpen((prevState: boolean) => !prevState);
    }, []);

    return (
        <Box>
            <Button color="primary" onClick={handleOpenDateForm}>
                <Typography variant="h6">
                    {startDate.format("DD.MM.YYYY")} -{" "}
                    {endDate.format("DD.MM.YYYY")}
                </Typography>
            </Button>
            <DialogForm
                title="Период"
                isFormOpen={dateFormOpen}
                handleOpenForm={handleOpenDateForm}
            >
                <Box display="flex" justifyContent="center" alignItems="center">
                    <DateRange
                        editableDateInputs={true}
                        locale={ru}
                        onChange={handleSetRange}
                        moveRangeOnFirstSelection={false}
                        ranges={range}
                    />
                </Box>
                <ButtonForm onClick={handleOpenDateForm} color="error">
                    Закрыть
                </ButtonForm>
            </DialogForm>
        </Box>
    );
};

export default PeriodAppBar;
