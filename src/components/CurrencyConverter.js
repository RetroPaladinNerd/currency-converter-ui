import React, { useState, useEffect } from 'react';
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
    shouldForwardProp: (prop) => prop !== 'isExchangeRates',
})(({ theme, isExchangeRates }) => ({
    padding: theme.spacing(2.5),
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: theme.palette.background.paper,
    transition: 'transform 0.2s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
    },
    ...(isExchangeRates && {
        flexGrow: 1,
    }),
    ...(!isExchangeRates && {
        flexGrow: 1,
    }),
    width: '100%',
    boxSizing: 'border-box',
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
    justifyContent: 'space-between', // Убеждаемся, что футер прижат к низу
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
    flexGrow: 1, // Занимает всё доступное пространство
    minHeight: 'calc(100vh - 60px)', // Учитываем высоту футера (примерно 60px с padding)
}));

const Footer = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(3), // Увеличиваем внутренний отступ, чтобы покрыть зазор
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
    const itemsPerPage = 7;

    useEffect(() => {
        fetchInitialData();
    }, []);

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
                <LeftColumn>
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
                    <StyledPaper elevation={1} isExchangeRates>
                        <Typography variant="subtitle1" style={{ fontWeight: 600, marginBottom: '8px' }}>
                            Текущие курсы
                        </Typography>
                        <RateListContainer>
                            {currentExchangeRates.map((rate, index) => {
                                const nextRate = currentExchangeRates[index + 1];
                                const addExtraSpace = nextRate && rate.bankId !== nextRate.bankId;
                                return (
                                    <RateItem key={index} addExtraSpace={addExtraSpace}>
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
    );
}

export default CurrencyConverter;