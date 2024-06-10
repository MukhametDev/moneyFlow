import { useCallback, useState } from "react";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import {
    LocalizationProvider,
    StaticDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

type IProps = {
    date: Dayjs;
    setDate: (date: Dayjs) => void;
};

const DateForm: React.FC<IProps> = ({ date, setDate }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

    const handleToggleCalendar = useCallback(() => {
        setIsCalendarOpen((prevState) => !prevState);
    }, []);

    const handleCloseCalendar = useCallback(() => {
        setIsCalendarOpen(false);
    }, []);

    const handleDateChange = useCallback(
        (value: Dayjs | null) => {
            if (value) {
                setDate(value);
            }
        },
        [setDate]
    );

    return (
        <>
            <ListItemButton onClick={handleToggleCalendar}>
                <ListItemText>Дата</ListItemText>
                <ListItemText sx={{ textAlign: "end" }}>
                    {date?.format("DD MMM YYYY HH:mm")}
                </ListItemText>
            </ListItemButton>
            <Collapse in={isCalendarOpen}>
                <ListItem sx={{ justifyContent: "center" }}>
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="ru"
                    >
                        <StaticDateTimePicker
                            value={date}
                            onChange={handleDateChange}
                            onAccept={handleCloseCalendar}
                            onClose={handleCloseCalendar}
                        />
                    </LocalizationProvider>
                </ListItem>
            </Collapse>
        </>
    );
};
export default DateForm;
