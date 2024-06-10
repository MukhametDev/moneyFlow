import { useCallback, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useTheme } from "@mui/material/styles";
import { tranStore } from "../store/transaction";
import { PieChart } from "@mui/x-charts/PieChart";
import {
    Box,
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
    List,
    ListItemButton,
    ListItemText,
    Divider,
    Typography,
} from "@mui/material";
import { TransactionType } from "../type";
import MenuAppBar from "../components/AppBar/Menu";
import PeriodAppBar from "../components/AppBar/Period";

const Chart = observer(() => {
    const theme = useTheme();
    const { type, setType, dataChart } = tranStore;
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

    const handleChangeType = useCallback(
        (event: SelectChangeEvent) => {
            setType(event.target.value as TransactionType);
        },
        [setType]
    );

    useEffect(() => {
        const updateDimensions = () => {
            if (chartContainerRef.current) {
                const width = chartContainerRef.current.offsetWidth;
                const height = width * 0.5;
                setDimensions({ width, height });
            }
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);

        return () => {
            window.removeEventListener("resize", updateDimensions);
        };
    }, []);

    return (
        <Box width={"100%"}>
            <MenuAppBar>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <FormControl size="small" sx={{ m: 1, minWidth: 120 }}>
                        <Select
                            variant="standard"
                            value={type}
                            onChange={handleChangeType}
                        >
                            <MenuItem value={TransactionType.Expense}>
                                Расходы
                            </MenuItem>
                            <MenuItem value={TransactionType.Income}>
                                Доходы
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <PeriodAppBar />
                </Box>
            </MenuAppBar>
            {dataChart.length === 0 ? (
                <Typography
                    variant="h6"
                    sx={{ textAlign: "center", marginTop: 10 }}
                >
                    Нет данных
                </Typography>
            ) : (
                <Box>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexGrow={1}
                        sx={{ width: "100%", maxWidth: "100%", height: "40vh" }}
                    >
                        <PieChart
                            series={[
                                {
                                    paddingAngle: 3,
                                    innerRadius: "50%",
                                    outerRadius: "100%",
                                    data: dataChart,
                                    arcLabel: (d) => `${d.value} ₽`,
                                },
                            ]}
                            margin={{ right: 5 }}
                            width={dimensions.width}
                            height={dimensions.height}
                            legend={{ hidden: true }}
                        />
                    </Box>
                    <List
                        sx={{
                            color: theme.palette.text.primary,
                            borderRadius: theme.shape.borderRadius,
                        }}
                    >
                        {dataChart.map((data) => {
                            if (data.value === 0) {
                                return null;
                            }

                            return (
                                <Box
                                    sx={{ padding: "0px 8px 0px 8px" }}
                                    key={data.label}
                                >
                                    <ListItemButton
                                        sx={{ padding: 0, minHeight: 50 }}
                                    >
                                        <ListItemText primary={data.label} />
                                        <ListItemText
                                            sx={{ textAlign: "right" }}
                                            primary={
                                                type ===
                                                TransactionType.Expense ? (
                                                    <Box fontWeight="fontWeightMedium">
                                                        - {data.value} ₽
                                                    </Box>
                                                ) : (
                                                    <Box
                                                        color="green"
                                                        fontWeight="fontWeightMedium"
                                                    >
                                                        + {data.value} ₽
                                                    </Box>
                                                )
                                            }
                                        />
                                    </ListItemButton>
                                    <Divider component="li" />
                                </Box>
                            );
                        })}
                    </List>
                </Box>
            )}
        </Box>
    );
});

export default Chart;
