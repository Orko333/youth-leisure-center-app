import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../DataBase/supabaseClient.js';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, CircularProgress, Container,
    Alert, Snackbar, TextField, InputAdornment, TablePagination, Link as MuiLink
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import StudentForm from '../components/StudentForm.jsx';
import ConfirmationDialog from '../modals/ConfirmationDialog.jsx'; // Імпортуємо новий компонент

function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Стан для діалогу підтвердження видалення
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

    async function fetchStudents() {
        setLoading(true);
        const { data, error } = await supabase.from('students').select('*').order('full_name');
        if (error) {
            console.error('Error fetching students:', error);
            setNotification({ open: true, message: `Помилка завантаження: ${error.message}`, severity: 'error' });
        } else {
            setStudents(data);
        }
        setLoading(false);
    }

    useEffect(() => { fetchStudents(); }, []);

    const handleOpenDialog = (student = null) => { setEditingStudent(student); setDialogOpen(true); };
    const handleCloseDialog = () => { setDialogOpen(false); setEditingStudent(null); };

    const handleSaveStudent = async (studentData) => {
        const { id, ...updateData } = studentData;
        const result = id
            ? await supabase.from('students').update(updateData).eq('id', id)
            : await supabase.from('students').insert(updateData);

        if (result.error) {
            setNotification({ open: true, message: `Помилка: ${result.error.message}`, severity: 'error' });
        } else {
            setNotification({ open: true, message: 'Дані успішно збережено!', severity: 'success' });
            handleCloseDialog();
            fetchStudents();
        }
    };

    // Крок 1: Відкриття діалогу підтвердження
    const handleDeleteClick = (studentId) => {
        setStudentToDelete(studentId);
        setConfirmOpen(true);
    };

    // Крок 2: Виконання видалення після підтвердження
    const executeDelete = async () => {
        setConfirmOpen(false);
        if (studentToDelete) {
            const { error } = await supabase.from('students').delete().eq('id', studentToDelete);
            if (error) {
                setNotification({ open: true, message: `Помилка видалення: ${error.message}`, severity: 'error' });
            } else {
                setNotification({ open: true, message: 'Учня видалено.', severity: 'success' });
                fetchStudents();
            }
            setStudentToDelete(null);
        }
    };

    const handleCloseNotification = (event, reason) => { if (reason === 'clickaway') return; setNotification({ ...notification, open: false }); };
    const filteredStudents = useMemo(() => students.filter(s => s.full_name.toLowerCase().includes(filter.toLowerCase()) || (s.phone && s.phone.includes(filter))), [students, filter]);
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4">Керування учнями</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Додати учня</Button>
            </Box>
            <Paper sx={{ mb: 2, p: 2, borderRadius: 3 }}><TextField fullWidth variant="outlined" placeholder="Пошук за ПІБ або телефоном..." value={filter} onChange={(e) => setFilter(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), }}/></Paper>
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead><TableRow><TableCell sx={{ fontWeight: 'bold' }}>ПІБ</TableCell><TableCell sx={{ fontWeight: 'bold' }}>Дата народження</TableCell><TableCell sx={{ fontWeight: 'bold' }}>Телефон</TableCell><TableCell sx={{ fontWeight: 'bold' }}>Школа</TableCell><TableCell align="right" sx={{ fontWeight: 'bold' }}>Дії</TableCell></TableRow></TableHead>
                        <TableBody>
                            {filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student) => (
                                <TableRow key={student.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell><MuiLink component={RouterLink} to={`/students/${student.id}`} sx={{ fontWeight: 500 }}>{student.full_name}</MuiLink></TableCell>
                                    <TableCell>{new Date(student.date_of_birth).toLocaleDateString()}</TableCell>
                                    <TableCell>{student.phone || '–'}</TableCell>
                                    <TableCell>{student.school || '–'}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleOpenDialog(student)} color="primary"><EditIcon /></IconButton>
                                        <IconButton onClick={() => handleDeleteClick(student.id)} color="error"><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={filteredStudents.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} labelRowsPerPage="Рядків на сторінці:" labelDisplayedRows={({ from, to, count }) => `${from}-${to} з ${count}`} />
            </Paper>
            <StudentForm open={dialogOpen} onClose={handleCloseDialog} onSave={handleSaveStudent} studentToEdit={editingStudent} />
            <ConfirmationDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={executeDelete} title="Підтвердити видалення" contentText="Ви впевнені, що хочете видалити цього учня? Цю дію неможливо буде скасувати." />
            <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}><Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>{notification.message}</Alert></Snackbar>
        </Container>
    );
}

export default StudentsPage;