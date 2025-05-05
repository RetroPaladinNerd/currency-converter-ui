import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import CurrencyList from './components/CurrencyList'; // Предполагаемый компонент для валют
import { Container, Box } from '@mui/material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import './index.css';

// Заглушка для компонента Banks, замените на реальный компонент
const Banks = () => (
    <Box sx={{ padding: 2 }}>
        <h2>Банки</h2>
        <p>Здесь будет список банков.</p>
    </Box>
);

// Заглушка для компонента ExchangeRates, замените на реальный компонент
const ExchangeRates = () => (
    <Box sx={{ padding: 2 }}>
        <h2>Обменные курсы</h2>
        <p>Здесь будут обменные курсы.</p>
    </Box>
);

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

// Обновлённый Sidebar с использованием маршрутизации
function SidebarWithRouter(props) {
    const navigate = useNavigate();
    const location = useLocation();

    // Определяем текущую вкладку на основе пути
    const getSelectedTab = () => {
        if (location.pathname === '/currencies') return 'currencies';
        if (location.pathname === '/banks') return 'banks';
        if (location.pathname === '/exchange-rates') return 'exchange-rates';
        return 'converter'; // По умолчанию
    };

    const handleTabChange = (tab) => {
        switch (tab) {
            case 'converter':
                navigate('/');
                break;
            case 'currencies':
                navigate('/currencies');
                break;
            case 'banks':
                navigate('/banks');
                break;
            case 'exchange-rates':
                navigate('/exchange-rates');
                break;
            default:
                navigate('/');
        }
    };

    return <Sidebar {...props} onTabChange={handleTabChange} selectedTab={getSelectedTab()} />;
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router basename="/">
                <AppContainer disableGutters>
                    <SidebarWithRouter />
                    <MainContentContainer>
                        <Routes>
                            <Route path="/" element={<MainContent selectedTab="converter" />} />
                            <Route path="/currencies" element={<CurrencyList />} />
                            <Route path="/banks" element={<Banks />} />
                            <Route path="/exchange-rates" element={<ExchangeRates />} />
                        </Routes>
                    </MainContentContainer>
                </AppContainer>
            </Router>
        </ThemeProvider>
    );
}

export default App;