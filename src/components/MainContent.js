import React from 'react';
import BankList from './BankList';
import CurrencyList from './CurrencyList';
import ExchangeRateList from './ExchangeRateList';
import CurrencyConverter from './CurrencyConverter';
import { Box } from '@mui/material';

function MainContent({ selectedTab }) {
    return (
        <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            {selectedTab === 'banks' && <BankList />}
            {selectedTab === 'currencies' && <CurrencyList />}
            {selectedTab === 'exchangeRates' && <ExchangeRateList />}
            {selectedTab === 'converter' && <CurrencyConverter />}
        </Box>
    );
}

export default MainContent;