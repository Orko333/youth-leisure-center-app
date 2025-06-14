import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../DataBase/supabaseClient.js';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    CircularProgress,
    Container,
    Alert,
    Snackbar,
    TextField,
    InputAdornment,
    TablePagination,
    Tooltip,
    Link as MuiLink
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import TeacherForm from '../modals/TeacherForm.jsx';
import ConfirmationDialog from '../modals/ConfirmationDialog.jsx';

function TeachersPage() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    
    const [formOpen, setFormOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState(null);

    async function fetchTeachers() {
        setLoading(true);
        const { data, error } = await supabase.from('teachers_with_details').select('*').order('full_name');
        if (error) {
            console.error('Error fetching teachers:', error);
            setNotification({ open: true, message: `Помилка завантаження: ${error.message}`, severity: 'error' });
        } else {
            setTeachers(data || []);
        }
        setLoading(false);
    }

    useEffect(() => { fetchTeachers(); }, []);

    const handleOpenForm = (teacher = null) => {
        setEditingTeacher(teacher);
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setEditingTeacher(null);
        setFormOpen(false);
    };

    const handleSaveTeacher = async (teacherData, specIds) => {
        const { id, specializations_list, ...updateData } = teacherData;

        const { data: savedTeacher, error: saveError } = id
            ? await supabase.from('teachers').update(updateData).eq('id', id).select().single()
            : await supabase.from('teachers').insert(updateData).select().single();

        if (saveError) {
            setNotification({ open: true, message: `Помилка: ${saveError.message}`, severity: 'error' });
            return;
        }

        const teacherId = savedTeacher.id;
        await supabase.from('teacher_specializations').delete().eq('teacher_id', teacherId);

        if (specIds && specIds.length > 0) {
            const newRelations = specIds.map(specId => ({ teacher_id: teacherId, specialization_id: specId }));
            await supabase.from('teacher_specializations').insert(newRelations);
        }

        setNotification({ open: true, message: 'Дані викладача збережено!', severity: 'success' });
        handleCloseForm();
        fetchTeachers();
    };

    const handleDeleteClick = (teacherId) => {
        setTeacherToDelete(teacherId);
        setConfirmOpen(true);
    };

    const executeDelete = async () => {
        const { error } = await supabase.from('teachers').delete().eq('id', teacherToDelete);
        if (error) {
            setNotification({ open: true, message: `Помилка видалення: ${error.message}`, severity: 'error' });
        } else {
            setNotification({ open: true, message: 'Викладача видалено.', severity: 'success' });
            fetchTeachers();
        }
        setConfirmOpen(false);
        setTeacherToDelete(null);
    };

    const filteredTeachers = useMemo(() => teachers.filter(t =>
        t.full_name.toLowerCase().includes(filter.toLowerCase()) ||
        (t.specializations_list && t.specializations_list.toLowerCase().includes(filter.toLowerCase()))
    ), [teachers, filter]);

    const handleCloseNotification = (event, reason) => {
        if (reason === 'clickaway') return;
        setNotification({ ...notification, open: false });
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">Керування викладачами</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>Додати викладача</Button>
            </Box>
            <Paper sx={{ mb: 2, p: 2, borderRadius: 3 }}>
                <TextField fullWidth placeholder="Пошук за ПІБ або спеціалізацією..." value={filter} onChange={(e) => setFilter(e.target.value)} InputProps={{startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>)}}/>
            </Paper>
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead><TableRow><TableCell>ПІБ</TableCell><TableCell>Телефон</TableCell><TableCell>Освіта</TableCell><TableCell>Спеціалізації</TableCell><TableCell align="right">Дії</TableCell></TableRow></TableHead>
                        <TableBody>
                            {filteredTeachers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((teacher) => (
                                <TableRow key={teacher.id} hover>
                                    <TableCell sx={{ fontWeight: 500 }}>
                                        <MuiLink component={RouterLink} to={`/teachers/${teacher.id}`} underline="hover">
                                            {teacher.full_name}
                                        </MuiLink>
                                    </TableCell>
                                    <TableCell>{teacher.phone || '–'}</TableCell>
                                    <TableCell>{teacher.education || '–'}</TableCell>
                                    <TableCell sx={{ maxWidth: 300 }}>{teacher.specializations_list || 'Не вказано'}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Редагувати"><IconButton onClick={() => handleOpenForm(teacher)} color="primary"><EditIcon /></IconButton></Tooltip>
                                        <Tooltip title="Видалити"><IconButton onClick={() => handleDeleteClick(teacher.id)} color="error"><DeleteIcon /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={filteredTeachers.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} labelRowsPerPage="Рядків:"/>
            </Paper>
            <TeacherForm open={formOpen} onClose={handleCloseForm} onSave={handleSaveTeacher} teacherToEdit={editingTeacher} />
            <ConfirmationDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={executeDelete} title="Підтвердити видалення" contentText="Ви впевнені, що хочете видалити викладача? Ця дія незворотня."/>
            <Snackbar open={notification.open} autoHideDuration={4000} onClose={handleCloseNotification}><Alert onClose={handleCloseNotification} severity={notification.severity}>{notification.message}</Alert></Snackbar>
        </Container>
    );
}

export default TeachersPage;