import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
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
    minHeight: '100vh',
    padding: 0,
    backgroundColor: theme.palette.background.default,
    maxWidth: '100% !important',
});

const MainContentContainer = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(2),
    position: 'relative',
    overflowY: 'auto',
    maxHeight: '100vh',
    boxSizing: 'border-box',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: theme.palette.background.default,
}));

const Footer = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(2),
    backgroundColor: '#f5f5f5',
    marginTop: theme.spacing(2),
    width: '100vw',
    boxSizing: 'border-box',
    borderTop: '1px solid #e0e0e0',
    position: 'relative',
    left: '50%',
    right: '50%',
    marginLeft: '-50vw',
    marginRight: '-50vw',
}));

const FooterLinks = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '10px',
});

const FooterLink = styled('a')({
    color: '#007aff',
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    },
});

function App() {
    const [selectedTab, setSelectedTab] = useState('converter');

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <ThemeProvider theme={theme}>
            <AppContainer disableGutters>
                <Sidebar onTabChange={handleTabChange} selectedTab={selectedTab} />
                <MainContentContainer>
                    <MainContent selectedTab={selectedTab} />
                </MainContentContainer>
            </AppContainer>
            <Footer>
                <FooterLinks>
                    <FooterLink href="https://currency-converter-ui-wccs.onrender.com/">Converter</FooterLink>
                    <FooterLink href="https://currency-converter-ui-wccs.onrender.com/currencies">Currencies</FooterLink>
                    <FooterLink href="https://currency-converter-ui-wccs.onrender.com/banks">Banks</FooterLink>
                    <FooterLink href="https://currency-converter-ui-wccs.onrender.com/exchange-rates">Exchange Rates</FooterLink>
                </FooterLinks>
                <Typography variant="body2" color="textSecondary">
                    © 2025 Currency Converter. All rights reserved. | Contact: <FooterLink href="https://t.me/insolitudeallalone" target="_blank" rel="noopener noreferrer">Telegram</FooterLink>
                </Typography>
            </Footer>
        </ThemeProvider>
    );
}

export default App;