import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, styled } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EuroIcon from '@mui/icons-material/Euro';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const SidebarContainer = styled(Drawer)(({ theme }) => ({
    width: 200,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: 200,
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e0e0e0',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    },
}));

function Sidebar({ onTabChange, selectedTab }) {
    const handleTabClick = (tab) => {
        onTabChange(tab);
    };

    return (
        <SidebarContainer variant="permanent" anchor="left">
            <List>
                <ListItem button selected={selectedTab === 'converter'} onClick={() => handleTabClick('converter')}>
                    <ListItemIcon>
                        <SwapHorizIcon sx={{ color: selectedTab === 'converter' ? '#007aff' : '#666666' }} />
                    </ListItemIcon>
                    <ListItemText primary="Конвертер" />
                </ListItem>
                <ListItem button selected={selectedTab === 'banks'} onClick={() => handleTabClick('banks')}>
                    <ListItemIcon>
                        <AccountBalanceIcon sx={{ color: selectedTab === 'banks' ? '#007aff' : '#666666' }} />
                    </ListItemIcon>
                    <ListItemText primary="Банки" />
                </ListItem>
                <ListItem button selected={selectedTab === 'currencies'} onClick={() => handleTabClick('currencies')}>
                    <ListItemIcon>
                        <EuroIcon sx={{ color: selectedTab === 'currencies' ? '#007aff' : '#666666' }} />
                    </ListItemIcon>
                    <ListItemText primary="Валюты" />
                </ListItem>
                <ListItem button selected={selectedTab === 'exchangeRates'} onClick={() => handleTabClick('exchangeRates')}>
                    <ListItemIcon>
                        <AttachMoneyIcon sx={{ color: selectedTab === 'exchangeRates' ? '#007aff' : '#666666' }} />
                    </ListItemIcon>
                    <ListItemText primary="Обменные курсы" />
                </ListItem>
            </List>
        </SidebarContainer>
    );
}

export default Sidebar;