import React, { useState, useEffect, useCallback } from 'react';
import {
    Paper, Typography, Box, IconButton, Dialog, DialogActions, DialogContent,
    DialogTitle, TextField, Button, Select, MenuItem, FormControl, InputLabel, Pagination
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import exchangeRateService from '../services/exchangeRateService';
import bankService from '../services/bankService';
import currencyService from '../services/currencyService';
import { styled } from '@mui/system';
import { Fade } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
    transition: 'transform 0.2s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
    },
}));

const StyledAddBox = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    marginTop: '16px',
});

const ExchangeRateItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    marginBottom: theme.spacing(0.5),
    transition: 'box-shadow 0.2s ease',
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
}));

const ChartContainer = styled(Box)(({ theme }) => ({
    height: '100px',
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    borderRadius: '8px',
    padding: theme.spacing(1),
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
}));

const MainContent = styled(Box)({
    minHeight: '100vh',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

const Footer = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(2),
    backgroundColor: '#f5f5f5',
    borderTop: '1px solid #e0e0e0',
    width: '83vw',
    boxSizing: 'border-box',
    marginLeft: 'calc(-50vw + 50%)',
    marginRight: 'calc(-50vw + 50%)',
}));

const FooterLinks = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '10px',
});

const FooterLink = styled(Link)({
    color: '#007aff',
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    },
});

function ExchangeRateList() {
    const [exchangeRates, setExchangeRates] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedExchangeRateId, setSelectedExchangeRateId] = useState(null);
    const [editing, setEditing] = useState(false);
    const [banks, setBanks] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [bankMap, setBankMap] = useState({});
    const [bankId, setBankId] = useState('');
    const [fromCurrencyCode, setFromCurrencyCode] = useState('');
    const [toCurrencyCode, setToCurrencyCode] = useState('');
    const [rate, setRate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const fetchExchangeRates = useCallback(async () => {
        try {
            const data = await exchangeRateService.getAllExchangeRates();
            if (Array.isArray(data)) {
                setExchangeRates(data);
            } else {
                console.error("API вернул данные не в виде массива для обменных курсов:", data);
                setExchangeRates([]);
            }
        } catch (error) {
            console.error("Ошибка при получении обменных курсов:", error);
            setExchangeRates([]);
        }
    }, []);

    const fetchBanks = useCallback(async () => {
        try {
            const data = await bankService.getAllBanks();
            if (Array.isArray(data)) {
                setBanks(data);
                const bankMap = {};
                data.forEach(bank => {
                    bankMap[bank.id] = bank;
                });
                setBankMap(bankMap);
            } else {
                console.error("API вернул данные не в виде массива для банков:", data);
                setBanks([]);
                setBankMap({});
            }
        } catch (error) {
            console.error("Ошибка при получении банков:", error);
            setBanks([]);
            setBankMap({});
        }
    }, []);

    const fetchCurrencies = useCallback(async () => {
        try {
            const data = await currencyService.getAllCurrencies();
            if (Array.isArray(data)) {
                setCurrencies(data);
            } else {
                console.error("API вернул данные не в виде массива для валют:", data);
                setCurrencies([]);
            }
        } catch (error) {
            console.error("Ошибка при получении валют:", error);
            setCurrencies([]);
        }
    }, []);

    const fetchInitialData = useCallback(async () => {
        await Promise.all([fetchExchangeRates(), fetchBanks(), fetchCurrencies()]);
    }, [fetchExchangeRates, fetchBanks, fetchCurrencies]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const handleOpen = () => {
        setBankId('');
        setFromCurrencyCode('');
        setToCurrencyCode('');
        setRate('');
        setSelectedExchangeRateId(null);
        setEditing(false);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreateExchangeRate = async () => {
        try {
            await exchangeRateService.createExchangeRate(bankId, fromCurrencyCode, toCurrencyCode, parseFloat(rate));
            fetchInitialData();
            handleClose();
        } catch (error) {
            console.error("Ошибка при создании обменного курса:", error);
            alert("Ошибка при создании обменного курса: " + (error.response?.data?.message || error.message));
        }
    };

    const handleUpdateExchangeRate = async () => {
        try {
            await exchangeRateService.updateExchangeRate(selectedExchangeRateId, fromCurrencyCode, toCurrencyCode, parseFloat(rate));
            fetchInitialData();
            handleClose();
        } catch (error) {
            console.error("Ошибка при обновлении обменного курса:", error);
            alert("Ошибка при обновлении обменного курса: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteExchangeRate = async (id) => {
        try {
            await exchangeRateService.deleteExchangeRate(id);
            fetchInitialData();
        } catch (error) {
            console.error("Ошибка при удалении обменного курса:", error);
            alert("Ошибка при удалении обменного курса: " + (error.response?.data?.message || error.message));
        }
    };

    const handleEditExchangeRate = (exchangeRate) => {
        setSelectedExchangeRateId(exchangeRate.id);
        setBankId(exchangeRate.bankId || '');
        setFromCurrencyCode(exchangeRate.fromCurrencyCode);
        setToCurrencyCode(exchangeRate.toCurrencyCode);
        setRate(exchangeRate.rate);
        setEditing(true);
        setOpen(true);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentExchangeRates = exchangeRates.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(exchangeRates.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Функция для подготовки данных графика
    const getChartData = (exchangeRate) => {
        // Симуляция исторических данных (можно заменить на реальные данные из API)
        const days = ['День 1', 'День 2', 'День 3', 'День 4', 'День 5'];
        const baseRate = exchangeRate.rate;
        const data = days.map((day, index) => ({
            x: day,
            y: baseRate + (Math.random() - 0.5) * 0.1, // Случайные колебания
        }));

        return {
            labels: days,
            datasets: [{
                label: `${exchangeRate.fromCurrencyCode} → ${exchangeRate.toCurrencyCode}`,
                data: data.map(d => d.y),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4,
            }],
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                display: true,
                title: { display: false },
            },
            y: {
                display: true,
                title: { display: false },
                beginAtZero: false,
            },
        },
    };

    return (
        <>
            <MainContent>
                <StyledPaper elevation={1}>
                    <Typography variant="subtitle1" style={{ fontWeight: 600, marginBottom: '16px' }}>
                        Обменные курсы
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {Array.isArray(currentExchangeRates) && currentExchangeRates.map((exchangeRate) => {
                            const bank = bankMap[exchangeRate.bankId];
                            const bankName = bank ? bank.name : "Неизвестный банк";
                            return (
                                <Fade in key={exchangeRate.id} timeout={300}>
                                    <Box>
                                        <ExchangeRateItem>
                                            <Box>
                                                <Typography variant="body1">
                                                    <Typography component="span">{exchangeRate.fromCurrencyCode}</Typography>
                                                    {' → '}
                                                    <Typography component="span">{exchangeRate.toCurrencyCode}</Typography>
                                                    {`: ${exchangeRate.rate}`}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Банк: {bankName}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <IconButton onClick={() => handleEditExchangeRate(exchangeRate)} size="small">
                                                    <ModeEditOutlineIcon fontSize="small" sx={{ color: '#666666', '&:hover': { color: '#007aff' } }} />
                                                </IconButton>
                                                <IconButton onClick={() => handleDeleteExchangeRate(exchangeRate.id)} size="small">
                                                    <DeleteOutlineIcon fontSize="small" sx={{ color: '#666666', '&:hover': { color: '#007aff' } }} />
                                                </IconButton>
                                            </Box>
                                        </ExchangeRateItem>
                                        <ChartContainer>
                                            <Line data={getChartData(exchangeRate)} options={chartOptions} />
                                        </ChartContainer>
                                    </Box>
                                </Fade>
                            );
                        })}
                        {Array.isArray(exchangeRates) && exchangeRates.length === 0 && (
                            <Typography variant="body2" align="center" sx={{ mt: 2, color: '#666666' }}>
                                Обменные курсы не найдены.
                            </Typography>
                        )}
                        {!Array.isArray(exchangeRates) && (
                            <Typography variant="body2" align="center" sx={{ mt: 2, color: 'red' }}>
                                Ошибка загрузки данных.
                            </Typography>
                        )}
                    </Box>
                    <StyledAddBox>
                        <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<AddIcon />}>
                            Добавить курс
                        </Button>
                    </StyledAddBox>
                    {exchangeRates.length > itemsPerPage && (
                        <PaginationContainer>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                shape="rounded"
                            />
                        </PaginationContainer>
                    )}
                </StyledPaper>
                <Footer>
                    <FooterLinks>
                        <FooterLink to="/">Converter</FooterLink>
                        <FooterLink to="/currencies">Currencies</FooterLink>
                        <FooterLink to="/banks">Banks</FooterLink>
                        <FooterLink to="/exchange-rates">Exchange Rates</FooterLink>
                    </FooterLinks>
                    <Typography variant="body2" color="textSecondary">
                        © 2025 Currency Converter. All rights reserved. | Contact: <FooterLink component="a" href="https://t.me/insolitudeallalone" target="_blank" rel="noopener noreferrer">Telegram</FooterLink>
                    </Typography>
                </Footer>
            </MainContent>
            <Dialog 
                open={open} 
                onClose={handleClose} 
                TransitionComponent={Fade} 
                TransitionProps={{ timeout: 300 }}
                sx={{ '& .MuiDialog-paper': { width: '400px', maxWidth: '400px' } }}
            >
                <DialogTitle>{editing ? "Редактировать обменный курс" : "Создать обменный курс"}</DialogTitle>
                <DialogContent>
                    {!editing && (
                        <FormControl fullWidth margin="dense" size="small" variant="outlined">
                            <InputLabel id="bank-select-label">Банк</InputLabel>
                            <Select
                                labelId="bank-select-label"
                                id="bank-select"
                                value={bankId}
                                label="Банк"
                                onChange={(e) => setBankId(e.target.value)}
                            >
                                {banks.map((bank) => (
                                    <MenuItem key={bank.id} value={bank.id}>{bank.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    <FormControl fullWidth margin="dense" size="small" variant="outlined">
                        <InputLabel id="from-currency-select-label">Из валюты</InputLabel>
                        <Select
                            labelId="from-currency-select-label"
                            id="from-currency-select"
                            value={fromCurrencyCode}
                            label="Из валюты"
                            onChange={(e) => setFromCurrencyCode(e.target.value)}
                        >
                            {currencies.map((currency) => (
                                <MenuItem key={currency.code} value={currency.code}>{currency.code}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense" size="small" variant="outlined">
                        <InputLabel id="to-currency-select-label">В валюту</InputLabel>
                        <Select
                            labelId="to-currency-select-label"
                            id="to-currency-select"
                            value={toCurrencyCode}
                            label="В валюту"
                            onChange={(e) => setToCurrencyCode(e.target.value)}
                        >
                            {currencies.map((currency) => (
                                <MenuItem key={currency.code} value={currency.code}>{currency.code}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        id="rate"
                        label="Курс"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        size="small"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Отмена</Button>
                    <Button onClick={editing ? handleUpdateExchangeRate : handleCreateExchangeRate} color="primary">
                        {editing ? "Сохранить" : "Создать"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ExchangeRateList;