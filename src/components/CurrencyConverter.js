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

// Main outer container for the whole page content + footer
const PageContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // Ensure it takes at least the full viewport height
    width: '100%', // Ensure it takes full width
    boxSizing: 'border-box',
});

// Container for the main content area (left and right columns)
const MainContentContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    padding: theme.spacing(1),
    width: '100%',
    maxWidth: '100%', // Changed from a fixed value if any, to allow responsiveness
    margin: '0 auto', // Center the content container if needed, adjust as per layout
    overflowX: 'hidden',
    boxSizing: 'border-box',
    flexGrow: 1, // Allow this container to grow and push the footer down
}));

const LeftColumn = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    // Removed width: '100%' as flex: 1 handles width distribution
}));

const RightColumn = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    // Removed width: '100%' as flex: 1 handles width distribution
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
    // Removed flexGrow from here as the parent columns handle flex distribution
    width: '100%', // Let paper take full width of its column
    boxSizing: 'border-box',
    // Specific height/flex properties if needed for internal layout within paper
    ...(isExchangeRates && {
         display: 'flex', // Make paper a flex container if needed for its content
         flexDirection: 'column', // Stack content vertically
         // flexGrow: 1, // Removed, handled by RightColumn flex:1
    }),
    // ...(!isExchangeRates && { // Removed, handled by LeftColumn flex:1
    //     flexGrow: 1,
    // }),
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
    // Removed marginBottom, let PaginationContainer handle spacing if needed
    // Or let the parent StyledPaper handle padding
     flexGrow: 1, // Allow rate list to take available space within its paper
     overflowY: 'auto', // Add scroll if content overflows
}));

const BankListContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(1), // Spacing above pagination
    paddingTop: theme.spacing(1), // Ensure padding doesn't collapse
}));

// Footer styled component - adjusted marginTop and removed conflicting centering styles potentially
const Footer = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(2),
    backgroundColor: '#f5f5f5',
    borderTop: '1px solid #e0e0e0',
    width: '83vw', // Keep this as requested
    boxSizing: 'border-box',
    // The marginLeft/Right might need adjustment depending on the overall page structure
    // If PageContainer is full width, these might center the 83vw footer correctly.
    marginLeft: 'calc(-50vw + 50%)', // Keep these calculations for centering the 83vw width
    marginRight: 'calc(-50vw + 50%)',
    marginTop: 'auto', // Pushes the footer to the bottom of the flex container (PageContainer)
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
    const itemsPerPage = 7; // Keep this number low if RateItem height is significant

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
                    // Ensure ratesByBank[rate.bankId] exists before assignment
                     if (ratesByBank[rate.bankId] && rate.toCurrencyCode === 'BYN') {
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

     const handleConvert = async () => { // Made async for potential future API calls
        try {
            if (!bank || !fromCurrency || !toCurrency || !amount || parseFloat(amount) <= 0) {
                setResult('Пожалуйста, заполните все поля корректно');
                return;
            }
             // Use optional chaining for safety when accessing bankMap
            const selectedBankName = bankMap[bank]?.name || 'Выбранный банк';

            // Find the rate directly from exchangeRates state
            const rateData = exchangeRates.find(rate =>
                rate.bankId === bank &&
                rate.fromCurrencyCode === fromCurrency &&
                rate.toCurrencyCode === toCurrency
            );

            if (!rateData) {
                 // Check if the inverse rate exists
                const inverseRateData = exchangeRates.find(rate =>
                    rate.bankId === bank &&
                    rate.fromCurrencyCode === toCurrency &&
                    rate.toCurrencyCode === fromCurrency
                );
                 if (inverseRateData && inverseRateData.rate && parseFloat(inverseRateData.rate) !== 0) {
                    const inverseRate = parseFloat(inverseRateData.rate);
                    const convertedAmount = (parseFloat(amount) / inverseRate).toFixed(4); // Use more precision for inverse calculation
                    setResult(`${convertedAmount} ${toCurrency}`);
                } else {
                    setResult(`Курс для ${fromCurrency} → ${toCurrency} в банке "${selectedBankName}" не найден`);
                }
                return;
            }

            const rate = parseFloat(rateData.rate);
            if (isNaN(rate)) {
                 setResult('Некорректное значение курса');
                 return;
            }

            const convertedAmount = (parseFloat(amount) * rate).toFixed(2);
            setResult(`${convertedAmount} ${toCurrency}`);
        } catch (error) {
            console.error("Ошибка при конвертации:", error);
            setResult('Ошибка конвертации');
        }
    };


    const handleSwapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setResult(''); // Clear the result when swapping currencies
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // Ensure exchangeRates is an array before slicing
    const currentExchangeRates = Array.isArray(exchangeRates) ? exchangeRates.slice(indexOfFirstItem, indexOfLastItem) : [];
    const totalPages = Array.isArray(exchangeRates) ? Math.ceil(exchangeRates.length / itemsPerPage) : 0;


    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        // Use PageContainer as the outermost element
        <PageContainer>
            {/* Main content area */}
            <MainContentContainer>
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
                                InputProps={{ inputProps: { min: 0 } }} // Prevent negative numbers
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
                            Список банков (Основные курсы к BYN)
                        </Typography>
                        <BankListContainer>
                            {banks.map((bank) => (
                                <BankItem key={bank.id}>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{bank.name}</Typography>
                                    {bankRates[bank.id] ? ( // Check if bankRates[bank.id] exists
                                        <Box sx={{ mt: 0.5, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
                                            {/* Indicate if no rates found for this bank */}
                                            {!bankRates[bank.id].usdToByn && !bankRates[bank.id].rubToByn && !bankRates[bank.id].eurToByn && (
                                                <Typography variant="caption" color="text.disabled">Нет данных</Typography>
                                            )}
                                        </Box>
                                    ) : (
                                         <Typography variant="caption" color="text.disabled">Нет данных</Typography>
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
                    {/* Ensure isExchangeRates prop is passed correctly */}
                    <StyledPaper elevation={1} isExchangeRates={true}>
                        <Typography variant="subtitle1" style={{ fontWeight: 600, marginBottom: '8px' }}>
                            Текущие курсы (Все)
                        </Typography>
                         {/* RateListContainer now grows and handles potential overflow */}
                        <RateListContainer>
                            {currentExchangeRates.length > 0 ? currentExchangeRates.map((rate, index) => {
                                // Logic for adding space between different banks seems fine
                                // const nextRate = currentExchangeRates[index + 1];
                                // const addExtraSpace = nextRate && rate.bankId !== nextRate.bankId; // Removed for simplicity, relies on item marginBottom

                                // Ensure bank name is available
                                const bankName = bankMap[rate.bankId]?.name || 'Неизвестный банк';
                                return (
                                    <RateItem key={`${rate.bankId}-${rate.fromCurrencyCode}-${rate.toCurrencyCode}-${index}`} /*addExtraSpace={addExtraSpace}*/>
                                        <Typography variant="body1" sx={{ flexBasis: '60%', textAlign: 'left' }}>
                                            {rate.fromCurrencyCode} → {rate.toCurrencyCode}: {rate.rate}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ flexBasis: '40%', textAlign: 'right' }}>
                                            Банк: {bankName}
                                        </Typography>
                                    </RateItem>
                                );
                            }) : (
                                 <Typography variant="body2" align="center" sx={{ mt: 1, color: '#666666' }}>
                                    {exchangeRates === null ? 'Загрузка курсов...' : 'Курсы не найдены.'}
                                </Typography>
                            )}
                        </RateListContainer>
                        {/* Pagination is now outside RateListContainer but inside StyledPaper */}
                        {totalPages > 1 && (
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
            </MainContentContainer>

            {/* Footer remains at the end of PageContainer */}
            <Footer>
                <FooterLinks>
                    <FooterLink to="/">Converter</FooterLink>
                    <FooterLink to="/currencies">Currencies</FooterLink>
                    <FooterLink to="/banks">Banks</FooterLink>
                    <FooterLink to="/exchange-rates">Exchange Rates</FooterLink>
                </FooterLinks>
                <Typography variant="body2" color="textSecondary">
                    © {new Date().getFullYear()} Currency Converter. All rights reserved. | Contact: <FooterLink component="a" href="https://t.me/insolitudeallalone" target="_blank" rel="noopener noreferrer">Telegram</FooterLink>
                </Typography>
            </Footer>
        </PageContainer>
    );
}

export default CurrencyConverter;