import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, styled } from '@mui/material';
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

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    color: '#666666',
    '&.Mui-selected': {
        color: '#007aff',
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
    },
    '&:hover': {
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
    },
}));

function Sidebar({ setActiveSection, activeSection }) {
    const menuItems = [
        { text: 'Конвертер', value: 'converter', icon: <SwapHorizIcon /> },
        { text: 'Банки', value: 'banks', icon: <AccountBalanceIcon /> },
        { text: 'Валюты', value: 'currencies', icon: <EuroIcon /> },
        { text: 'Обменные курсы', value: 'exchange-rates', icon: <AttachMoneyIcon /> },
    ];

    return (
        <SidebarContainer variant="permanent" anchor="left">
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.value} disablePadding>
                        <StyledListItemButton
                            selected={activeSection === item.value}
                            onClick={() => setActiveSection(item.value)}
                        >
                            <ListItemIcon sx={{ color: 'inherit' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </StyledListItemButton>
                    </ListItem>
                ))}
            </List>
        </SidebarContainer>
    );
}

export default Sidebar;