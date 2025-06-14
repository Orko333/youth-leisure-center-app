import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../DataBase/supabaseClient.js';
import {
    Container, Typography, CircularProgress, Box, Grid, Card, CardContent,
    List, ListItem, ListItemText, Divider, Chip, Avatar, Paper, ListItemIcon
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CakeIcon from '@mui/icons-material/Cake';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import HistoryIcon from '@mui/icons-material/History';

const getInitials = (name = '') => name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '';

function StudentProfilePage() {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStudentData() {
            setLoading(true);
            const { data, error } = await supabase.from('students').select(`*, enrollments (id, start_date, end_date, groups (id, name, circles (id, name)))`).eq('id', studentId).single();
            if (error && error.code !== 'PGRST116') { console.error('Error fetching student profile:', error); } else { setStudent(data); }
            setLoading(false);
        }
        if (studentId) { fetchStudentData(); }
    }, [studentId]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    if (!student) return <Typography variant="h5" align="center" sx={{ mt: 5 }}>Учня не знайдено.</Typography>;

    const enrollments = student.enrollments || [];
    const activeEnrollments = enrollments.filter(e => e && e.end_date === null);
    const pastEnrollments = enrollments.filter(e => e && e.end_date !== null);

    return (
        <Container maxWidth="lg">
            <Paper sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', borderRadius: 3 }}>
                <Avatar sx={{ width: 90, height: 90, mr: 3, bgcolor: 'primary.main', fontSize: '3rem' }}>
                    {getInitials(student.full_name)}
                </Avatar>
                <Box><Typography variant="h4" gutterBottom>{student.full_name || 'Ім\'я не вказано'}</Typography><Typography variant="subtitle1" color="text.secondary">Профіль учня</Typography></Box>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} md={5}><Card><CardContent><Typography variant="h6" gutterBottom>Особисті дані</Typography><List><ListItem><ListItemIcon><CakeIcon color="action" /></ListItemIcon><ListItemText primary="Дата народження" secondary={student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : 'Не вказано'} /></ListItem><ListItem><ListItemIcon><PhoneIcon color="action" /></ListItemIcon><ListItemText primary="Телефон" secondary={student.phone || 'Не вказано'} /></ListItem><ListItem><ListItemIcon><HomeIcon color="action" /></ListItemIcon><ListItemText primary="Адреса" secondary={student.address || 'Не вказано'} /></ListItem><ListItem><ListItemIcon><SchoolIcon color="action" /></ListItemIcon><ListItemText primary="Навчальний заклад" secondary={`${student.school || 'Не вказано'}, клас ${student.grade || '–'}`} /></ListItem><ListItem><ListItemIcon><PersonIcon color="action" /></ListItemIcon><ListItemText primary="Батьки" secondary={student.parent_info || 'Не вказано'} /></ListItem></List></CardContent></Card></Grid>
                <Grid item xs={12} md={7}><Card><CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}><HistoryIcon color="action" sx={{ mr: 1 }} /><Typography variant="h6">Історія відвідувань</Typography></Box>
                    <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>Активні зарахування</Typography>
                    {activeEnrollments.length > 0 ? (
                        activeEnrollments.map(e => (
                            
                            <Box key={e.id} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'success.light', borderRadius: 2, borderLeft: '5px solid', borderLeftColor: 'success.main', bgcolor: '#f1f8e9' }}>
                                <Typography variant="body1"><b>Гурток:</b> {e.groups?.circles?.name ?? 'Інформація відсутня'}</Typography>
                                <Typography variant="body1"><b>Група:</b> {e.groups?.name ?? 'Групу видалено'}</Typography>
                                <Chip label="Активний" color="success" size="small" sx={{ mt: 1 }} />
                            </Box>
                        ))
                    ) : <Typography color="text.secondary" sx={{ml: 1}}>Немає активних зарахувань.</Typography>}
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>Минулі зарахування</Typography>
                    {pastEnrollments.length > 0 ? (
                        pastEnrollments.map(e => (
                            <Box key={e.id} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, borderLeft: '5px solid', borderLeftColor: 'grey.500', bgcolor: '#fafafa' }}>
                                <Typography variant="body1"><b>Гурток:</b> {e.groups?.circles?.name ?? 'Інформація відсутня'}</Typography>
                                <Typography variant="body1"><b>Група:</b> {e.groups?.name ?? 'Групу видалено'}</Typography>
                                <Typography variant="body2" color="text.secondary">Період: {e.start_date && e.end_date ? `${new Date(e.start_date).toLocaleDateString()} - ${new Date(e.end_date).toLocaleDateString()}` : 'Період не вказано'}</Typography>
                                <Chip label="Завершено" color="default" size="small" sx={{ mt: 1 }} />
                            </Box>
                        ))
                    ) : <Typography color="text.secondary" sx={{ml: 1}}>Немає минулих зарахувань.</Typography>}
                </CardContent></Card></Grid>
            </Grid>
        </Container>
    );
}

export default StudentProfilePage;