import { Outlet, NavLink } from 'react-router-dom';
import { AppBar, Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import CategoryIcon from '@mui/icons-material/Category';

const drawerWidth = 280;

const menuItems = [
    { text: 'Головна', icon: <HomeIcon />, path: '/' },
    { text: 'Керування групами', icon: <CategoryIcon />, path: '/groups' },
    { text: 'Керування учнями', icon: <SchoolIcon />, path: '/students' },
];

function Layout() {
    const theme = useTheme();
    const activeLinkStyle = { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, '& .MuiListItemIcon-root': { color: theme.palette.primary.contrastText, }, '&:hover': { backgroundColor: theme.palette.primary.dark, } };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h5" noWrap component="div" sx={{ fontWeight: 'bold' }}> {}
                        АІС "Дозвілля молоді"
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto', p: 1 }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton component={NavLink} to={item.path} end={item.path === '/'} sx={({ isActive }) => (isActive ? activeLinkStyle : {})}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 4, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}> {}
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}

export default Layout;