import { useState, useEffect } from 'react';
import { supabase } from '../DataBase/supabaseClient.js';
import {
    Typography, Container, Grid, Card, CardContent, Box, Avatar,
    CircularProgress, List, ListItem, ListItemText, ListItemAvatar, Divider, Link as MuiLink, Paper, Button, ListItemIcon
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CategoryIcon from '@mui/icons-material/Category';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const getInitials = (name = '') => name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '';

const StatCard = ({ title, value, icon, color }) => (
    <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center', borderRadius: 3, height: '100%' }}>
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.dark`, mr: 2, width: 48, height: 48 }}>{icon}</Avatar>
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{value}</Typography>
            <Typography color="text.secondary">{title}</Typography>
        </Box>
    </Paper>
);

function HomePage() {
    const [stats, setStats] = useState({ students: 0, groups: 0, teachers: 0, newStudentsWeek: 0, newGroupsWeek: 0 });
    const [recentStudents, setRecentStudents] = useState([]);
    const [topGroups, setTopGroups] = useState([]);
    const [allCircles, setAllCircles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchDashboardData() {
            setLoading(true);
            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
            const [
                { count: studentsCount }, { count: groupsCount }, { count: teachersCount },
                { count: newStudentsWeekCount }, { count: newGroupsWeekCount },
                { data: recentStudentsData }, { data: topGroupsData }, { data: circlesData }
            ] = await Promise.all([
                supabase.from('students').select('*', { count: 'exact', head: true }),
                supabase.from('groups').select('*', { count: 'exact', head: true }),
                supabase.from('teachers').select('*', { count: 'exact', head: true }),
                supabase.from('students').select('*', { count: 'exact', head: true }).gt('created_at', oneWeekAgo),
                supabase.from('groups').select('*', { count: 'exact', head: true }).gt('created_at', oneWeekAgo),
                supabase.from('students').select('id, full_name, created_at').order('created_at', { ascending: false }).limit(5),
                supabase.from('groups_with_details').select('id, name, student_count').order('student_count', { ascending: false }).limit(5),
                supabase.from('circles').select('id, name').order('name'),
            ]);
            setStats({ students: studentsCount, groups: groupsCount, teachers: teachersCount, newStudentsWeek: newStudentsWeekCount, newGroupsWeek: newGroupsWeekCount });
            setRecentStudents(recentStudentsData || []);
            setTopGroups(topGroupsData || []);
            setAllCircles(circlesData || []);
            setLoading(false);
        }
        fetchDashboardData();
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress size={60} /></Box>;
    }

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" sx={{ mb: 4 }}>Головна панель</Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}><StatCard title="Всього учнів" value={stats.students} icon={<PeopleIcon />} color="primary" /></Grid>
                <Grid item xs={12} sm={4}><StatCard title="Активних груп" value={stats.groups} icon={<GroupWorkIcon />} color="secondary" /></Grid>
                <Grid item xs={12} sm={4}><StatCard title="Викладачів" value={stats.teachers} icon={<SchoolIcon />} color="success" /></Grid>
            </Grid>

            {/* === ОСНОВНИЙ КОНТЕНТ В ТРЬОХ КОЛОНКАХ === */}
            <Grid container spacing={3}>
                {/* --- ЛІВА КОЛОНКА (5/12 ширини) --- */}
                <Grid item xs={12} md={5}>
                    <Card sx={{ p: 2, height: '100%' }}>
                        <CardContent>
                            <Typography variant="h5" sx={{ mb: 2 }}>Швидкі дії</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Button fullWidth variant="outlined" startIcon={<AddCircleIcon />} size="large" onClick={() => navigate('/students')}>Додати учня</Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button fullWidth variant="outlined" color="secondary" startIcon={<GroupAddIcon />} size="large" onClick={() => navigate('/groups')}>Створити групу</Button>
                                </Grid>
                            </Grid>
                            <Divider sx={{ my: 3 }} />
                            <Typography variant="h6" gutterBottom>Нещодавно додані учні</Typography>
                            <List>
                                {recentStudents.map(student => (
                                    <ListItem key={student.id}><ListItemAvatar><Avatar sx={{ bgcolor: 'primary.light' }}>{getInitials(student.full_name)}</Avatar></ListItemAvatar><ListItemText primary={<MuiLink component={RouterLink} to={`/students/${student.id}`} underline="hover">{student.full_name}</MuiLink>} secondary={`Додано: ${new Date(student.created_at).toLocaleDateString()}`} /></ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* --- ЦЕНТРАЛЬНА КОЛОНКА (4/12 ширини) --- */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Найбільші групи</Typography>
                            <Divider sx={{ mb: 1 }}/>
                            <List>
                                {topGroups.map(group => (
                                    <ListItem key={group.id} secondaryAction={<Typography variant="subtitle1" fontWeight="bold">{group.student_count}</Typography>}>
                                        <ListItemIcon><Avatar sx={{ bgcolor: 'secondary.light', width: 40, height: 40 }}><GroupWorkIcon fontSize="small" /></Avatar></ListItemIcon>
                                        <ListItemText primary={<MuiLink component={RouterLink} to={`/groups/${group.id}`} underline="hover">{group.name}</MuiLink>} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* --- ПРАВА КОЛОНКА (3/12 ширини) --- */}
                <Grid item xs={12} md={3}>
                    <Grid container spacing={3} direction="column">
                        <Grid item>
                            <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <TrendingUpIcon color="action" sx={{ mr: 1 }} />
                                    <Typography variant="h6">Активність</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                                    <Box><Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark', width: 56, height: 56, margin: '0 auto 8px' }}><PersonAddAlt1Icon /></Avatar><Typography variant="h4" sx={{ fontWeight: 'bold' }}>+{stats.newStudentsWeek}</Typography><Typography color="text.secondary" variant="body2">Нових учнів</Typography></Box>
                                    <Box><Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.dark', width: 56, height: 56, margin: '0 auto 8px' }}><GroupAddIcon /></Avatar><Typography variant="h4" sx={{ fontWeight: 'bold' }}>+{stats.newGroupsWeek}</Typography><Typography color="text.secondary" variant="body2">Нових груп</Typography></Box>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Наші гуртки</Typography>
                                    <Divider sx={{ mb: 1 }}/>
                                    <List dense sx={{ maxHeight: 250, overflow: 'auto' }}>
                                        {allCircles.map(circle => (
                                            <ListItem key={circle.id}>
                                                <ListItemIcon sx={{minWidth: 32}}><CategoryIcon color="action" fontSize="small" /></ListItemIcon>
                                                <ListItemText primary={circle.name} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}

export default HomePage;