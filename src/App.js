import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CurrencyConverter from './components/CurrencyConverter';
import BankList from './components/BankList';
import CurrencyList from './components/CurrencyList';
import ExchangeRateList from './components/ExchangeRateList';
import { Container, Box } from '@mui/material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import './index.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#007aff',
            light: '#e6f0ff',
        },
        secondary: {
            main: '#cccccc',
        },
        background: {
            default: '#f5f7fa',
            paper: '#ffffff',
        },
        text: {
            primary: '#333333',
            secondary: '#666666',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
        fontSize: 16,
        subtitle1: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        body1: {
            fontSize: '1.1rem',
            fontWeight: 400,
            color: '#333333',
        },
        body2: {
            fontSize: '0.95rem',
            color: '#666666',
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 500,
                    padding: '10px 20px',
                    boxShadow: 'none',
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                        boxShadow: 'none',
                        backgroundColor: '#e6f0ff',
                    },
                },
                containedPrimary: {
                    backgroundColor: '#007aff',
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: '#005bb5',
                    },
                },
                textPrimary: {
                    color: '#007aff',
                    '&:hover': {
                        backgroundColor: 'rgba(0,122,255,0.1)',
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                },
                notchedOutline: {
                    borderColor: '#e0e0e0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#007aff',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#007aff',
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#666666',
                    '&.Mui-focused': {
                        color: '#007aff',
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    borderRadius: '12px',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: '16px',
                    padding: '16px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                },
            },
        },
    },
});

const AppContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: 0,
    backgroundColor: theme.palette.background.default,
    maxWidth: '100% !important',
});

const MainContentContainer = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(2),
    boxSizing: 'border-box',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
}));

const SidebarAndContent = styled(Box)({
    display: 'flex',
    flexGrow: 1,
    width: '100%',
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <AppContainer disableGutters>
                    <SidebarAndContent>
                        <Sidebar />
                        <MainContentContainer>
                            <Routes>
                                <Route path="/" element={<CurrencyConverter />} />
                                <Route path="/banks" element={<BankList />} />
                                <Route path="/currencies" element={<CurrencyList />} />
                                <Route path="/exchange-rates" element={<ExchangeRateList />} />
                            </Routes>
                        </MainContentContainer>
                    </SidebarAndContent>
                </AppContainer>
            </Router>
        </ThemeProvider>
    );
}

export default App;