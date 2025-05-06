import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
    Typography, Box, IconButton, Dialog, DialogActions, DialogContent,
    DialogTitle, TextField, Button, Pagination, Select, MenuItem, FormControl, InputLabel, Grid
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import currencyService from '../services/currencyService';
import { styled } from '@mui/system';
import { Fade } from '@mui/material';

const StyledAddBox = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    marginTop: '16px',
});

const CurrencyItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    marginBottom: theme.spacing(0.5),
    wordBreak: 'break-word',
    transition: 'box-shadow 0.2s ease',
    width: '100%',
    boxSizing: 'border-box',
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
}));

const ControlsBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    overflowX: 'hidden',
    overflowY: 'auto',
    width: '300px',
    height: '350px',
    boxSizing: 'border-box',
}));

const CurrencyListBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    overflowX: 'hidden',
}));

const ListWrapper = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflowX: 'hidden',
});

const PaginationContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    overflowX: 'hidden',
}));

const MainContent = styled(Box)({
    minHeight: '100vh',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

function CurrencyList() {
    const [currencies, setCurrencies] = useState([]);
    const [filteredCurrencies, setFilteredCurrencies] = useState([]);
    const [filterCode, setFilterCode] = useState('');
    const [filterName, setFilterName] = useState('');
    const [sortBy, setSortBy] = useState('code');
    const [sortOrder, setSortOrder] = useState('asc');
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [currencyToDelete, setCurrencyToDelete] = useState(null);
    const [newCode, setNewCode] = useState('');
    const [newName, setNewName] = useState('');
    const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);
    const [editing, setEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [maxWidth, setMaxWidth] = useState('auto');
    const currencyRefs = useRef([]);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchCurrencies();
    }, []);

    const fetchCurrencies = async () => {
        try {
            const data = await currencyService.getAllCurrencies();
            if (Array.isArray(data)) {
                setCurrencies(data);
                setFilteredCurrencies(data);
            } else {
                console.error("API вернул данные не в виде массива для валют:", data);
                setCurrencies([]);
                setFilteredCurrencies([]);
            }
        } catch (error) {
            console.error("Ошибка при получении валют:", error);
            setCurrencies([]);
            setFilteredCurrencies([]);
        }
    };

    useLayoutEffect(() => {
        const widths = currencyRefs.current.map(ref => ref?.offsetWidth || 0);
        const max = Math.max(...widths);
        if (max > 0) {
            setMaxWidth(`${max}px`);
        }
    }, [filteredCurrencies, currentPage]);

    useEffect(() => {
        let updatedCurrencies = [...currencies];

        if (filterCode) {
            updatedCurrencies = updatedCurrencies.filter(
                (currency) => currency.code.toLowerCase() === filterCode.toLowerCase()
            );
        }

        if (filterName) {
            updatedCurrencies = updatedCurrencies.filter(
                (currency) => currency.name.toLowerCase() === filterName.toLowerCase()
            );
        }

        updatedCurrencies.sort((a, b) => {
            const valueA = sortBy === 'code' ? a.code.toLowerCase() : a.name.toLowerCase();
            const valueB = sortBy === 'code' ? b.code.toLowerCase() : b.name.toLowerCase();
            if (sortOrder === 'asc') {
                return valueA.localeCompare(valueB);
            } else {
                return valueB.localeCompare(valueA);
            }
        });

        setFilteredCurrencies(updatedCurrencies);
        setCurrentPage(1);
    }, [filterCode, filterName, sortBy, sortOrder, currencies]);

    const handleOpen = () => {
        setNewCode('');
        setNewName('');
        setSelectedCurrencyId(null);
        setEditing(false);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreateCurrency = async () => {
        if (!newCode.trim() || !newName.trim()) {
            return;
        }
        try {
            await currencyService.createCurrency(newCode, newName);
            fetchCurrencies();
            handleClose();
        } catch (error) {
            console.error("Ошибка при создании валюты:", error);
            alert("Ошибка при создании валюты: " + error.message);
        }
    };

    const handleUpdateCurrency = async () => {
        if (!newCode.trim() || !newName.trim()) {
            return;
        }
        try {
            await currencyService.updateCurrency(selectedCurrencyId, newCode, newName);
            fetchCurrencies();
            handleClose();
        } catch (error) {
            console.error("Ошибка при обновлении валюты:", error);
            alert("Ошибка при обновлении валюты: " + error.message);
        }
    };

    const handleOpenDeleteDialog = (currency) => {
        setCurrencyToDelete(currency);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setCurrencyToDelete(null);
    };

    const handleDeleteCurrency = async () => {
        if (!currencyToDelete) return;
        try {
            await currencyService.deleteCurrency(currencyToDelete.id);
            fetchCurrencies();
            handleCloseDeleteDialog();
        } catch (error) {
            console.error("Ошибка при удалении валюты:", error);
            alert("Ошибка при удалении валюты: " + error.message);
        }
    };

    const handleEditCurrency = (currency) => {
        setSelectedCurrencyId(currency.id);
        setNewCode(currency.code);
        setNewName(currency.name);
        setEditing(true);
        setOpen(true);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCurrencies = filteredCurrencies.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCurrencies.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const isFormValid = newCode.trim() && newName.trim();

    const handleCodeChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z]/g, '');
        setNewCode(value);
    };

    const handleNameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z]/g, '');
        setNewName(value);
    };

    return (
        <>
            <MainContent>
                <Box sx={{
                    maxWidth: '900px',
                    width: '100%',
                    margin: '0 auto',
                    flex: 1,
                }}>
                    <Grid container spacing={2} sx={{
                        width: '100%',
                        overflowX: 'hidden',
                    }} alignItems="flex-start" justifyContent="center">
                        <Grid item xs={6}>
                            <CurrencyListBox>
                                <Typography variant="subtitle1" style={{ fontWeight: 600, marginBottom: '16px' }}>
                                    Валюты
                                </Typography>
                                <ListWrapper>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {Array.isArray(currentCurrencies) && currentCurrencies.map((currency, index) => (
                                            <Fade in key={currency.id} timeout={300}>
                                                <CurrencyItem
                                                    ref={el => (currencyRefs.current[index] = el)}
                                                    sx={{ minWidth: maxWidth, margin: '0 auto' }}
                                                >
                                                    <Typography variant="body1">{`${currency.code} - ${currency.name}`}</Typography>
                                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                        <IconButton onClick={() => handleEditCurrency(currency)} size="small">
                                                            <ModeEditOutlineIcon fontSize="inherit" sx={{ color: '#666666', '&:hover': { color: '#007aff' } }} />
                                                        </IconButton>
                                                        <IconButton onClick={() => handleOpenDeleteDialog(currency)} size="small">
                                                            <DeleteOutlineIcon fontSize="inherit" sx={{ color: '#666666', '&:hover': { color: '#007aff' } }} />
                                                        </IconButton>
                                                    </Box>
                                                </CurrencyItem>
                                            </Fade>
                                        ))}
                                        {Array.isArray(filteredCurrencies) && filteredCurrencies.length === 0 && currencies.length > 0 && (
                                            <Typography variant="body2" align="center" sx={{ mt: 2, color: '#666666' }}>
                                                Валюты по фильтру не найдены.
                                            </Typography>
                                        )}
                                        {Array.isArray(currencies) && currencies.length === 0 && (
                                            <Typography variant="body2" align="center" sx={{ mt: 2, color: '#666666' }}>
                                                Валюты не добавлены.
                                            </Typography>
                                        )}
                                        {!Array.isArray(currencies) && (
                                            <Typography variant="body2" align="center" sx={{ mt: 2, color: 'red' }}>
                                                Ошибка загрузки данных.
                                            </Typography>
                                        )}
                                    </Box>
                                </ListWrapper>
                                <StyledAddBox>
                                    <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<AddIcon />}>
                                        Добавить валюту
                                    </Button>
                                </StyledAddBox>
                                {filteredCurrencies.length > itemsPerPage && (
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
                            </CurrencyListBox>
                        </Grid>
                        <Grid item xs={6}>
                            <ControlsBox>
                                <Typography variant="body2" sx={{ fontWeight: 700, mb: 2 }}>
                                    Фильтр валют
                                </Typography>
                                <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
                                    <InputLabel>Код валюты</InputLabel>
                                    <Select
                                        value={filterCode}
                                        onChange={(e) => setFilterCode(e.target.value)}
                                        label="Код валюты"
                                    >
                                        <MenuItem value="">Все</MenuItem>
                                        {currencies.map((currency) => (
                                            <MenuItem key={currency.id + '-code'} value={currency.code}>
                                                {currency.code}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
                                    <InputLabel>Название валюты</InputLabel>
                                    <Select
                                        value={filterName}
                                        onChange={(e) => setFilterName(e.target.value)}
                                        label="Название валюты"
                                    >
                                        <MenuItem value="">Все</MenuItem>
                                        {currencies.map((currency) => (
                                            <MenuItem key={currency.id + '-name'} value={currency.name}>
                                                {currency.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Typography variant="body2" sx={{ fontWeight: 700, mb: 2 }}>
                                    Сортировка
                                </Typography>
                                <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
                                    <InputLabel>Сортировать по</InputLabel>
                                    <Select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        label="Сортировать по"
                                    >
                                        <MenuItem value="code">Коду</MenuItem>
                                        <MenuItem value="name">Названию</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth variant="outlined" size="small">
                                    <InputLabel>Порядок</InputLabel>
                                    <Select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        label="Порядок"
                                    >
                                        <MenuItem value="asc">По возрастанию (A-Z)</MenuItem>
                                        <MenuItem value="desc">По убыванию (Z-A)</MenuItem>
                                    </Select>
                                </FormControl>
                            </ControlsBox>
                        </Grid>
                    </Grid>
                </Box>
            </MainContent>
            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 300 }}
                sx={{
                    '& .MuiDialog-paper': {
                        width: '400px',
                        minHeight: '300px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                    },
                }}
            >
                <DialogTitle>{editing ? "Редактировать валюту" : "Создать валюту"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="code"
                        label="Код валюты"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newCode}
                        onChange={handleCodeChange}
                        size="small"
                        required
                        inputProps={{ maxLength: 3 }}
                    />
                    <TextField
                        margin="dense"
                        id="name"
                        label="Название валюты"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newName}
                        onChange={handleNameChange}
                        size="small"
                        required
                    />
                    {!isFormValid && (
                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                            Все поля должны быть заполнены.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Отмена</Button>
                    <Button
                        onClick={editing ? handleUpdateCurrency : handleCreateCurrency}
                        color="primary"
                        disabled={!isFormValid}
                    >
                        {editing ? "Сохранить" : "Создать"}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 300 }}
            >
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Вы уверены, что хотите удалить валюту "{currencyToDelete?.code} - {currencyToDelete?.name}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">Отмена</Button>
                    <Button onClick={handleDeleteCurrency} color="primary">Удалить</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CurrencyList;