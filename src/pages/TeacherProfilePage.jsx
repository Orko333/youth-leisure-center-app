import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { supabase } from '../DataBase/supabaseClient.js';
import {
    Container, Typography, CircularProgress, Box, Grid, Card, CardContent,
    List, ListItem, ListItemText, Divider, Chip, Avatar, Paper, ListItemIcon, Link as MuiLink
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CakeIcon from '@mui/icons-material/Cake';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import GroupWorkIcon from '@mui/icons-material/GroupWork';

const getInitials = (name = '') => name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '';

function TeacherProfilePage() {
    const { teacherId } = useParams();
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTeacherData() {
            setLoading(true);
            
            const { data, error } = await supabase
                .from('teachers')
                .select(`
          *,
          teacher_specializations ( specializations ( name ) ),
          groups ( id, name, circles ( name ) )
        `)
                .eq('id', teacherId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error("Error fetching teacher profile:", error);
            } else {
                setTeacher(data);
            }
            setLoading(false);
        }
        if (teacherId) {
            fetchTeacherData();
        }
    }, [teacherId]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    }

    if (!teacher) {
        return <Typography variant="h5" align="center" sx={{ mt: 5 }}>Викладача не знайдено.</Typography>;
    }

    const specializations = teacher.teacher_specializations.map(ts => ts.specializations.name);

    return (
        <Container maxWidth="lg">
            <Paper sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', borderRadius: 3 }}>
                <Avatar sx={{ width: 90, height: 90, mr: 3, bgcolor: 'success.main', fontSize: '3rem' }}>
                    {getInitials(teacher.full_name)}
                </Avatar>
                <Box>
                    <Typography variant="h4" gutterBottom>{teacher.full_name}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">Профіль викладача</Typography>
                </Box>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                    <Card sx={{height: '100%'}}><CardContent>
                        <Typography variant="h6" gutterBottom>Особисті дані</Typography>
                        <List>
                            <ListItem><ListItemIcon><CakeIcon color="action" /></ListItemIcon><ListItemText primary="Дата народження" secondary={teacher.date_of_birth ? new Date(teacher.date_of_birth).toLocaleDateString() : 'Не вказано'} /></ListItem>
                            <ListItem><ListItemIcon><PhoneIcon color="action" /></ListItemIcon><ListItemText primary="Телефон" secondary={teacher.phone || 'Не вказано'} /></ListItem>
                            <ListItem><ListItemIcon><HomeIcon color="action" /></ListItemIcon><ListItemText primary="Адреса" secondary={teacher.address || 'Не вказано'} /></ListItem>
                            <ListItem><ListItemIcon><SchoolIcon color="action" /></ListItemIcon><ListItemText primary="Освіта" secondary={teacher.education || 'Не вказано'} /></ListItem>
                        </List>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <WorkspacePremiumIcon color="action" sx={{ mr: 1 }} />
                            <Typography variant="h6">Спеціалізації</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {specializations.length > 0 ? specializations.map(spec => (
                                <Chip key={spec} label={spec} color="primary" variant="outlined" />
                            )) : <Typography color="text.secondary">Не вказано</Typography>}
                        </Box>
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12} md={7}>
                    <Card sx={{height: '100%'}}><CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <GroupWorkIcon color="action" sx={{ mr: 1 }} />
                            <Typography variant="h6">Активні групи</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }}/>
                        {teacher.groups.length > 0 ? (
                            <List>
                                {teacher.groups.map(group => (
                                    <ListItem key={group.id} divider>
                                        <ListItemText
                                            primary={<MuiLink component={RouterLink} to={`/groups/${group.id}`} underline="hover" sx={{ fontWeight: 500 }}>{group.name}</MuiLink>}
                                            secondary={`Гурток: ${group.circles.name}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : <Typography color="text.secondary" sx={{ ml: 1 }}>Викладач наразі не веде жодної групи.</Typography>}
                    </CardContent></Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default TeacherProfilePage;