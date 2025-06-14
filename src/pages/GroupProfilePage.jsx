import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { supabase } from '../DataBase/supabaseClient.js';
import {
    Container,
    Typography,
    CircularProgress,
    Box,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Divider,
    Avatar,
    Paper,
    ListItemIcon,
    Link as MuiLink,
    ListItemAvatar
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import CategoryIcon from '@mui/icons-material/Category';
import SchoolIcon from '@mui/icons-material/School';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const getInitials = (name = '') => name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '';

function GroupProfilePage() {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [roster, setRoster] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGroupData() {
            setLoading(true);
            
            const { data: groupData, error: groupError } = await supabase
                .from('groups')
                .select(`*, circles(name), teachers(id, full_name)`)
                .eq('id', groupId)
                .single();

            const { data: rosterData, error: rosterError } = await supabase
                .from('enrollments')
                .select('students(id, full_name)')
                .eq('group_id', groupId)
                .is('end_date', null);

            if (groupError && groupError.code !== 'PGRST116') console.error("Error fetching group info:", groupError);
            if (rosterError) console.error("Error fetching roster:", rosterError);

            setGroup(groupData);
            setRoster(rosterData || []);
            setLoading(false);
        }
        if (groupId) {
            fetchGroupData();
        }
    }, [groupId]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    }

    if (!group) {
        return <Typography variant="h5" align="center" sx={{ mt: 5 }}>Групу не знайдено.</Typography>;
    }

    return (
        <Container maxWidth="lg">
            <Paper sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', borderRadius: 3 }}>
                <Avatar sx={{ width: 90, height: 90, mr: 3, bgcolor: 'secondary.main' }}>
                    <GroupIcon sx={{ fontSize: '3rem' }} />
                </Avatar>
                <Box>
                    <Typography variant="h4" gutterBottom>{group.name}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">Профіль групи</Typography>
                </Box>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Основна інформація</Typography>
                            <List>
                                <ListItem>
                                    <ListItemIcon><CategoryIcon color="action" /></ListItemIcon>
                                    <ListItemText primary="Гурток/Студія" secondary={group.circles?.name || 'Не вказано'} />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><SchoolIcon color="action" /></ListItemIcon>
                                    <ListItemText
                                        primary="Керівник"
                                        secondary={
                                            group.teachers ? (
                                                <MuiLink component={RouterLink} to={`/teachers/${group.teachers.id}`} underline="hover" sx={{ fontWeight: 500 }}>
                                                    {group.teachers.full_name}
                                                </MuiLink>
                                            ) : 'Не призначено'
                                        }
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PeopleAltIcon color="action" sx={{ mr: 1 }} />
                                <Typography variant="h6">Склад групи ({roster.length} учнів)</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            {roster.length > 0 ? (
                                <List>
                                    {roster.map(({ students }) => (
                                        students && <ListItem key={students.id} divider>
                                            <ListItemAvatar><Avatar sx={{ bgcolor: 'primary.light' }}>{getInitials(students.full_name)}</Avatar></ListItemAvatar>
                                            <ListItemText
                                                primary={<MuiLink component={RouterLink} to={`/students/${students.id}`} underline="hover" sx={{ fontWeight: 500 }}>{students.full_name}</MuiLink>}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : <Typography color="text.secondary" sx={{ ml: 1 }}>У цій групі ще немає учнів.</Typography>}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default GroupProfilePage;