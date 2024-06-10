import { useCallback, useState } from "react";
import CommentForm from "../Form/Comment";
import Divider from "@mui/material/Divider";
import ButtonForm from "../Form/Button";
import { IGroupBill } from "../../type";
import { user } from "../../store/user";

interface IProps {
    handleAddGroup: (groupBill: IGroupBill) => void;
    handleOpenForm: () => void;
}

const GroupBillForm: React.FC<IProps> = ({
    handleAddGroup,
    handleOpenForm,
}) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const handleNameChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
        },
        []
    );

    const handleDescriptionChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setDescription(event.target.value);
        },
        []
    );

    const handleSubmit = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();

            const newGroupBill = {
                id: "",
                userId: user.userId,
                name: name,
                description: description,
                bills: [],
            };

            handleAddGroup(newGroupBill);
            handleOpenForm();
        },
        [handleAddGroup, handleOpenForm, name,description]
    );

    return (
        <>
            <Divider component="li" />

            <CommentForm
                title="Название"
                value={name}
                handleChange={handleNameChange}
            />
            <CommentForm
                title="Описание"
                value={description}
                handleChange={handleDescriptionChange}
            />

            <Divider component="li" />

            <ButtonForm color="primary" onClick={handleSubmit}>
                Создать группу
            </ButtonForm>
        </>
    );
};

export default GroupBillForm;
