import React from "react";
import {
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import { observer } from "mobx-react-lite";

interface GroupBill {
    id: string;
    description: string;
    name: string;
}

interface IProps {
    groupBills: GroupBill[];
    groupBillId: string;
    handleSelectGroup: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const GroupBillSelector: React.FC<IProps> = observer(
    ({ groupBills, groupBillId, handleSelectGroup }) => {
        return (
            <FormControl sx={{ paddingTop: 2 }}>
                <FormLabel>Группы счетов</FormLabel>
                <RadioGroup value={groupBillId} onChange={handleSelectGroup}>
                    {groupBills.map((groupBill) => (
                        <FormControlLabel
                            key={groupBill.id}
                            label={groupBill.name}
                            value={groupBill.id}
                            control={<Radio />}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        );
    }
);

export default GroupBillSelector;
