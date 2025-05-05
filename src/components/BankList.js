import React, { useState, useEffect } from 'react';
import {
    Paper, Typography, Box, IconButton, Dialog, DialogActions, DialogContent,
    DialogTitle, TextField, Button, Pagination
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import bankService from '../services/bankService';
import { styled } from '@mui/system';
import { Fade } from '@mui/material';

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

const BankItem = styled(Box)(({ theme }) => ({
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
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
}));

const Footer = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(2),
    backgroundColor: '#f5f5f5',
    marginTop: theme.spacing(2),
    width: '100%',
    boxSizing: 'border-box',
    borderTop: '1px solid #e0e0e0',
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

function BankList() {
    const [banks, setBanks] = useState([]);
    const [open, setOpen] = useState(false);
    const [newBankName, setNewBankName] = useState('');
    const [selectedBankId, setSelectedBankId] = useState(null);
    const [editing, setEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchBanks();
    }, []);

    const fetchBanks = async () => {
        try {
            const data = await bankService.getAllBanks();
            setBanks(data);
        } catch (error) {
            console.error("Ошибка при получении банков:", error);
        }
    };

    const handleOpen = () => {
        setNewBankName('');
        setSelectedBankId(null);
        setEditing(false);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreateBank = async () => {
        try {
            await bankService.createBank(newBankName);
            fetchBanks();
            handleClose();
        } catch (error) {
            console.error("Ошибка при создании банка:", error);
            alert("Ошибка при создании банка: " + error.message);
        }
    };

    const handleUpdateBank = async () => {
        try {
            await bankService.updateBank(selectedBankId, newBankName);
            fetchBanks();
            handleClose();
        } catch (error) {
            console.error("Ошибка при обновлении банка:", error);
            alert("Ошибка при обновлении банка: " + error.message);
        }
    };

    const handleDeleteBank = async (id) => {
        try {
            await bankService.deleteBank(id);
            fetchBanks();
        } catch (error) {
            console.error("Ошибка при удалении банка:", error);
            alert("Ошибка при удалении банка: " + error.message);
        }
    };

    const handleEditBank = (bank) => {
        setSelectedBankId(bank.id);
        setNewBankName(bank.name);
        setEditing(true);
        setOpen(true);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBanks = banks.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(banks.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <>
            <StyledPaper elevation={1}>
                <Typography variant="subtitle1" style={{ fontWeight: 600, marginBottom: '16px' }}>
                    Банки
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {currentBanks.map((bank) => (
                        <Fade in key={bank.id} timeout={300}>
                            <BankItem>
                                <Typography variant="body1">{bank.name}</Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton onClick={() => handleEditBank(bank)} size="small">
                                        <ModeEditOutlineIcon fontSize="small" sx={{ color: '#666666', '&:hover': { color: '#007aff' } }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteBank(bank.id)} size="small">
                                        <DeleteOutlineIcon fontSize="small" sx={{ color: '#666666', '&:hover': { color: '#007aff' } }} />
                                    </IconButton>
                                </Box>
                            </BankItem>
                        </Fade>
                    ))}
                    {banks.length === 0 && (
                        <Typography variant="body2" align="center" sx={{ mt: 2, color: '#666666' }}>
                            Банки не найдены.
                        </Typography>
                    )}
                </Box>
                <StyledAddBox>
                    <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<AddIcon />}>
                        Добавить банк
                    </Button>
                </StyledAddBox>
                {banks.length > itemsPerPage && (
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
            <Dialog open={open} onClose={handleClose} TransitionComponent={Fade} TransitionProps={{ timeout: 300 }}>
                <DialogTitle>{editing ? "Редактировать банк" : "Создать банк"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Название банка"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newBankName}
                        onChange={(e) => setNewBankName(e.target.value)}
                        size="small"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Отмена</Button>
                    <Button onClick={editing ? handleUpdateBank : handleCreateBank} color="primary">
                        {editing ? "Сохранить" : "Создать"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default BankList;