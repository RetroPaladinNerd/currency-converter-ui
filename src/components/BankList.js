import React, { useState, useEffect } from 'react';
import {
    Paper, Typography, Box, IconButton, Dialog, DialogActions, DialogContent,
    DialogTitle, TextField, Button, Pagination, CircularProgress
} from '@mui/material';
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
    minWidth: '300px',
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
}));

const MainContent = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
});

function BankList() {
    const [banks, setBanks] = useState([]);
    const [open, setOpen] = useState(false);
    const [newBankName, setNewBankName] = useState('');
    const [selectedBankId, setSelectedBankId] = useState(null);
    const [editing, setEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [bankToDelete, setBankToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchBanks();
    }, []);

    const fetchBanks = async () => {
        setLoading(true);
        try {
            const data = await bankService.getAllBanks();
            setBanks(data);
        } catch (error) {
            console.error("Ошибка при получении банков:", error);
        } finally {
            setLoading(false);
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

    const handleOpenDeleteDialog = (bank) => {
        setBankToDelete(bank);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setBankToDelete(null);
    };

    const handleDeleteBank = async () => {
        if (!bankToDelete) return;
        try {
            await bankService.deleteBank(bankToDelete.id);
            fetchBanks();
            handleCloseDeleteDialog();
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
        <MainContent>
            <StyledPaper elevation={1}>
                <Typography variant="subtitle1" style={{ fontWeight: 600, marginBottom: '16px' }}>
                    Банки
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                            <CircularProgress />
                        </Box>
                    ) : currentBanks.length === 0 ? (
                        <Typography variant="body2" align="center" sx={{ mt: 2, color: '#666666' }}>
                            Загрузка...
                        </Typography>
                    ) : (
                        currentBanks.map((bank) => (
                            <Fade in key={bank.id} timeout={300}>
                                <BankItem>
                                    <Typography variant="body1">{bank.name}</Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton onClick={() => handleEditBank(bank)} size="small">
                                            <ModeEditOutlineIcon fontSize="small" sx={{ color: '#666666', '&:hover': { color: '#007aff' } }} />
                                        </IconButton>
                                        <IconButton onClick={() => handleOpenDeleteDialog(bank)} size="small">
                                            <DeleteOutlineIcon fontSize="small" sx={{ color: '#666666', '&:hover': { color: '#007aff' } }} />
                                        </IconButton>
                                    </Box>
                                </BankItem>
                            </Fade>
                        ))
                    )}
                </Box>
                <StyledAddBox>
                    <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<AddIcon />} disabled={loading}>
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
                            disabled={loading}
                        />
                    </PaginationContainer>
                )}
            </StyledPaper>
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
                        disabled={loading}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" disabled={loading}>Отмена</Button>
                    <Button onClick={editing ? handleUpdateBank : handleCreateBank} color="primary" disabled={loading || !newBankName.trim()}>
                        {editing ? "Сохранить" : "Создать"}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog} TransitionComponent={Fade} TransitionProps={{ timeout: 300 }}>
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Вы уверены, что хотите удалить банк "{bankToDelete?.name}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary" disabled={loading}>Отмена</Button>
                    <Button onClick={handleDeleteBank} color="primary" disabled={loading}>Удалить</Button>
                </DialogActions>
            </Dialog>
        </MainContent>
    );
}

export default BankList;