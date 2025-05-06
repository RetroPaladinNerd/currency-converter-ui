import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Paper, Typography, Box, Select, MenuItem, TextField, Button, FormControl,
    InputLabel, Pagination, IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import exchangeRateService from '../services/exchangeRateService';
import bankService from '../services/bankService';
import currencyService from '../services/currencyService';

const LeftColumn = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: '100%',
}));

const RightColumn = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
}));

const StyledPaper = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'isExchangeRates' && prop !== 'adjustedHeight',
})(({ theme, isExchangeRates, adjustedHeight }) => ({
    padding: theme.spacing(2.5),
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: theme.palette.background.paper,
    transition: 'transform 0.2s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
    },
    ...(isExchangeRates && {
        height: adjustedHeight ? `${adjustedHeight}px` : 'auto',
    }),
    ...(!isExchangeRates && {
        flexGrow: 1,
    }),
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
}));

const StyledFormBox = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px',
});

const RateItem = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'addExtraSpace',
})(({ theme, addExtraSpace }) => ({
    padding: theme.spacing(1),
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    marginBottom: addExtraSpace ? theme.spacing(2) : theme.spacing(0.5),
    transition: 'box-shadow 0.2s ease',
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

const BankItem = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1),
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    marginBottom: theme.spacing(0.5),
}));

const RateListContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    marginBottom: theme.spacing(3),
    flexGrow: 1,
    overflow: 'hidden',
}));

const BankListContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(1),
}));

const MainContent = styled(Box)({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
});

const MainContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    padding: theme.spacing(1),
    width: '100%',
    maxWidth: '100%',
    margin: '0 auto',
    marginBottom: theme.spacing(6),
    overflowX: 'hidden',
    boxSizing: 'border-box',
    flexGrow: 1,
}));

function CurrencyConverter() {
    const [banks, setBanks] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [bank, setBank] = useState('');
    const [fromCurrency, setFromCurrency] = useState('');
    const [toCurrency, setToCurrency] = useState('');
    const [amount, setAmount] = useState('');
    const [result, setResult] = useState('');
    const [exchangeRates, setExchangeRates] = useState([]);
    const [bankMap, setBankMap] = useState({});
    const [bankRates, setBankRates] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(1); // Initial value, will be calculated
    const [leftColumnHeight, setLeftColumnHeight] = useState(0);

    const leftColumnRef = useRef(null);
    const rateListRef = useRef(null);
    const rateItemRef = useRef(null);

    const calculateHeights = useCallback(() => {
        // Calculate the height of the LeftColumn
        if (leftColumnRef.current) {
            const height = leftColumnRef.current.getBoundingClientRect().height;
            setLeftColumnHeight(height);
        }

        // Calculate itemsPerPage based on the height of the rate list card
        if (rateListRef.current && rateItemRef.current) {
            const rateListHeight = leftColumnRef.current.getBoundingClientRect().height;
            const rateItemHeight = rateItemRef.current.getBoundingClientRect().height;
            const titleHeight = 40; // Approximate height of the title and padding
            const paginationHeight = 40; // Approximate height of pagination
            const availableHeight = rateListHeight - titleHeight - paginationHeight;
            const calculatedItems = Math.floor(availableHeight / rateItemHeight);
            const newItemsPerPage = Math.max(1, calculatedItems); // Ensure at least 1 item
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1); // Reset to first page when items per page changes
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        calculateHeights();
        const resizeObserver = new ResizeObserver(() => {
            calculateHeights();
        });
        if (leftColumnRef.current) {
            resizeObserver.observe(leftColumnRef.current);
        }
        return () => {
            if (leftColumnRef.current) {
                resizeObserver.unobserve(leftColumnRef.current);
            }
        };
    }, [calculateHeights, banks, exchangeRates]);

    const fetchInitialData = async () => {
        try {
            const [bankData, currencyData, rateData] = await Promise.all([
                bankService.getAllBanks(),
                currencyService.getAllCurrencies(),
                exchangeRateService.getAllExchangeRates()
            ]);
            setBanks(bankData);
            setCurrencies(currencyData);
            if (Array.isArray(rateData)) {
                setExchangeRates(rateData);
                const ratesByBank = {};
                bankData.forEach(bank => {
                    ratesByBank[bank.id] = {
                        usdToByn: null,
                        eurToByn: null,
                        rubToByn: null,
                    };
                });
                rateData.forEach(rate => {
                    if (rate.toCurrencyCode === 'BYN') {
                        if (rate.fromCurrencyCode === 'USD') {
                            ratesByBank[rate.bankId].usdToByn = rate.rate;
                        } else if (rate.fromCurrencyCode === 'EUR') {
                            ratesByBank[rate.bankId].eurToByn = rate.rate;
                        } else if (rate.fromCurrencyCode === 'RUB') {
                            ratesByBank[rate.bankId].rubToByn = rate.rate;
                        }
                    }
                });
                setBankRates(ratesByBank);
            }
            const newBankMap = {};
            bankData.forEach(bank => {
                newBankMap[bank.id] = bank;
            });
            setBankMap(newBankMap);
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        }
    };

    const handleConvert = () => {
        try {
            if (!bank || !fromCurrency || !toCurrency || !amount || amount <= 0) {
                setResult('Пожалуйста, заполните все поля корректно');
                return;
            }
            const rateData = exchangeRates.find(rate =>
                rate.bankId === bank &&
                rate.fromCurrencyCode === fromCurrency &&
                rate.toCurrencyCode === toCurrency
            );
            if (!rateData) {
                setResult(`Курс для ${fromCurrency} → ${toCurrency} в данном банке не доступен`);
                return;
            }
            const rate = rateData.rate;
            const convertedAmount = (parseFloat(amount) * parseFloat(rate)).toFixed(2);
            setResult(`${convertedAmount} ${toCurrency}`);
        } catch (error) {
            console.error("Ошибка при конвертации:", error);
            setResult('Ошибка конвертации');
        }
    };

    const handleSwapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setResult('');
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentExchangeRates = exchangeRates.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(exchangeRates.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <MainContent>
            <MainContainer>
                <LeftColumn ref={leftColumnRef}>
                    <StyledPaper elevation={1}>
                        <Typography variant="subtitle1" style={{ fontWeight: 600, marginBottom: '8px' }}>
                            Конвертер валют
                        </Typography>
                        <StyledFormBox>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel id="bank-select-label">Банк</InputLabel>
                                <Select
                                    labelId="bank-select-label"
                                    id="bank-select"
                                    value={bank}
                                    label="Банк"
                                    onChange={(e) => setBank(e.target.value)}
                                >
                                    {banks.map((bank) => (
                                        <MenuItem key={bank.id} value={bank.id}>{bank.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FormControl fullWidth variant="outlined" size="small">
                                    <InputLabel id="from-currency-select-label">Из валюты</InputLabel>
                                    <Select
                                        labelId="from-currency-select-label"
                                        id="from-currency-select"
                                        value={fromCurrency}
                                        label="Из валюты"
                                        onChange={(e) => setFromCurrency(e.target.value)}
                                    >
                                        {currencies.map((currency) => (
                                            <MenuItem key={currency.code} value={currency.code}>{currency.code}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <IconButton onClick={handleSwapCurrencies} sx={{ p: 0 }}>
                                    <SwapVertIcon />
                                </IconButton>
                                <FormControl fullWidth variant="outlined" size="small">
                                    <InputLabel id="to-currency-select-label">В валюту</InputLabel>
                                    <Select
                                        labelId="to-currency-select-label"
                                        id="to-currency-select"
                                        value={toCurrency}
                                        label="В валюту"
                                        onChange={(e) => setToCurrency(e.target.value)}
                                    >
                                        {currencies.map((currency) => (
                                            <MenuItem key={currency.code} value={currency.code}>{currency.code}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <TextField
                                label="Сумма"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                variant="outlined"
                                size="small"
                                fullWidth
                            />
                            <Button variant="contained" color="primary" onClick={handleConvert}>
                                Конвертировать
                            </Button>
                            {result && (
                                <Typography variant="body1" align="center" sx={{ mt: 1 }}>
                                    Результат: {result}
                                </Typography>
                            )}
                        </StyledFormBox>
                    </StyledPaper>
                    <StyledPaper elevation={1}>
                        <Typography variant="subtitle1" style={{ fontWeight: 600, marginBottom: '8px' }}>
                            Список банков
                        </Typography>
                        <BankListContainer>
                            {banks.map((bank) => (
                                <BankItem key={bank.id}>
                                    <Typography variant="body1">{bank.name}</Typography>
                                    {bankRates[bank.id] && (
                                        <Box sx={{ mt: 0.5, display: 'flex', gap: 2 }}>
                                            {bankRates[bank.id].usdToByn && (
                                                <Typography variant="body2" color="text.secondary">
                                                    USD → BYN: {bankRates[bank.id].usdToByn}
                                                </Typography>
                                            )}
                                            {bankRates[bank.id].rubToByn && (
                                                <Typography variant="body2" color="text.secondary">
                                                    RUB → BYN: {bankRates[bank.id].rubToByn}
                                                </Typography>
                                            )}
                                            {bankRates[bank.id].eurToByn && (
                                                <Typography variant="body2" color="text.secondary">
                                                    EUR → BYN: {bankRates[bank.id].eurToByn}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </BankItem>
                            ))}
                            {banks.length === 0 && (
                                <Typography variant="body2" align="center" sx={{ mt: 1, color: '#666666' }}>
                                    Банки не найдены.
                                </Typography>
                            )}
                        </BankListContainer>
                    </StyledPaper>
                </LeftColumn>
                <RightColumn>
                    <StyledPaper elevation={1} isExchangeRates adjustedHeight={leftColumnHeight} ref={rateListRef}>
                        <Typography variant="subtitle1" style={{ fontWeight: 600, marginBottom: '8px' }}>
                            Текущие курсы
                        </Typography>
                        <RateListContainer>
                            {currentExchangeRates.map((rate, index) => {
                                const nextRate = currentExchangeRates[index + 1];
                                const addExtraSpace = nextRate && rate.bankId !== nextRate.bankId;
                                return (
                                    <RateItem
                                        key={index}
                                        addExtraSpace={addExtraSpace}
                                        ref={index === 0 ? rateItemRef : null}
                                    >
                                        <Typography variant="body1">
                                            {rate.fromCurrencyCode} → {rate.toCurrencyCode}: {rate.rate}
                                        </Typography>
                                        <Typography variant="body1" color="text.primary">
                                            Банк: {bankMap[rate.bankId]?.name || 'Неизвестный банк'}
                                        </Typography>
                                    </RateItem>
                                );
                            })}
                            {exchangeRates.length === 0 && (
                                <Typography variant="body2" align="center" sx={{ mt: 1, color: '#666666' }}>
                                    Курсы не найдены.
                                </Typography>
                            )}
                        </RateListContainer>
                        {exchangeRates.length > 0 && (
                            <PaginationContainer>
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                    shape="rounded"
                                    size="small"
                                />
                            </PaginationContainer>
                        )}
                    </StyledPaper>
                </RightColumn>
            </MainContainer>
        </MainContent>
    );
}

export default CurrencyConverter;