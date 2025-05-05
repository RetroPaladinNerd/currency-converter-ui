import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, styled } from '@mui/material';
import { NavLink } from 'react-router-dom';
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

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    color: '#666666',
    textDecoration: 'none',
    width: '100%',
    '&.active': {
        color: '#007aff',
    },
    '&:hover': {
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
    },
}));

function Sidebar() {
    return (
        <SidebarContainer variant="permanent" anchor="left">
            <List>
                <ListItem button component={StyledNavLink} to="/" activeClassName="active">
                    <ListItemIcon>
                        <SwapHorizIcon sx={{ color: 'inherit' }} />
                    </ListItemIcon>
                    <ListItemText primary="Конвертер" />
                </ListItem>
                <ListItem button component={StyledNavLink} to="/banks" activeClassName="active">
                    <ListItemIcon>
                        <AccountBalanceIcon sx={{ color: 'inherit' }} />
                    </ListItemIcon>
                    <ListItemText primary="Банки" />
                </ListItem>
                <ListItem button component={StyledNavLink} to="/currencies" activeClassName="active">
                    <ListItemIcon>
                        <EuroIcon sx={{ color: 'inherit' }} />
                    </ListItemIcon>
                    <ListItemText primary="Валюты" />
                </ListItem>
                <ListItem button component={StyledNavLink} to="/exchange-rates" activeClassName="active">
                    <ListItemIcon>
                        <AttachMoneyIcon sx={{ color: 'inherit' }} />
                    </ListItemIcon>
                    <ListItemText primary="Обменные курсы" />
                </ListItem>
            </List>
        </SidebarContainer>
    );
}

export default Sidebar;