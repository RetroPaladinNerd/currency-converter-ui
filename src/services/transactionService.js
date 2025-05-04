const getAllTransactions = () => {
    const transactions = localStorage.getItem('transactions');
    return transactions ? JSON.parse(transactions) : [];
};

const addTransaction = (transaction) => {
    const transactions = getAllTransactions();
    transactions.push({ ...transaction, id: transactions.length + 1, timestamp: new Date().toISOString() });
    localStorage.setItem('transactions', JSON.stringify(transactions));
};

const transactionService = {
    getAllTransactions,
    addTransaction,
};

export default transactionService;