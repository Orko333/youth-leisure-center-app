import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../DataBase/supabaseClient.js';
import {
    Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
    CircularProgress, Container, Alert, Snackbar, TextField, InputAdornment, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import SpecializationForm from '../modals/SpecializationForm.jsx';
import ConfirmationDialog from '../modals/ConfirmationDialog.jsx';

function SpecializationsPage() {
    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [filter, setFilter] = useState('');

    
    const [formOpen, setFormOpen] = useState(false);
    const [editingSpec, setEditingSpec] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [specToDelete, setSpecToDelete] = useState(null);

    async function fetchSpecializations() {
        setLoading(true);
        const { data, error } = await supabase.from('specializations').select('*').order('name');
        if (error) {
            console.error('Error fetching specializations:', error);
            setNotification({ open: true, message: `Помилка завантаження: ${error.message}`, severity: 'error' });
        } else {
            setSpecializations(data || []);
        }
        setLoading(false);
    }

    useEffect(() => { fetchSpecializations(); }, []);

    
    const handleOpenForm = (spec = null) => { setEditingSpec(spec); setFormOpen(true); };
    const handleCloseForm = () => { setEditingSpec(null); setFormOpen(false); };

    const handleSaveSpec = async (specData) => {
        const { id, ...updateData } = specData;
        const result = id
            ? await supabase.from('specializations').update(updateData).eq('id', id)
            : await supabase.from('specializations').insert(updateData);

        if (result.error) {
            setNotification({ open: true, message: `Помилка: ${result.error.message}`, severity: 'error' });
        } else {
            setNotification({ open: true, message: 'Спеціалізацію збережено!', severity: 'success' });
            handleCloseForm();
            fetchSpecializations();
        }
    };

    
    const handleDeleteClick = (specId) => { setSpecToDelete(specId); setConfirmOpen(true); };
    const executeDelete = async () => {
        const { error } = await supabase.from('specializations').delete().eq('id', specToDelete);
        if (error) {
            setNotification({ open: true, message: `Помилка: ${error.message}`, severity: 'error' });
        } else {
            setNotification({ open: true, message: 'Спеціалізацію видалено.', severity: 'success' });
            fetchSpecializations();
        }
        setConfirmOpen(false); setSpecToDelete(null);
    };

    const filteredSpecs = useMemo(() => specializations.filter(s =>
        s.name.toLowerCase().includes(filter.toLowerCase())
    ), [specializations, filter]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">Керування спеціалізаціями</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>Додати</Button>
            </Box>
            <Paper sx={{ mb: 2, p: 2, borderRadius: 3 }}>
                <TextField fullWidth placeholder="Пошук..." value={filter} onChange={(e) => setFilter(e.target.value)} InputProps={{startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>)}}/>
            </Paper>
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead><TableRow><TableCell>Назва спеціалізації</TableCell><TableCell align="right">Дії</TableCell></TableRow></TableHead>
                        <TableBody>
                            {filteredSpecs.map((spec) => (
                                <TableRow key={spec.id} hover>
                                    <TableCell sx={{ fontWeight: 500 }}>{spec.name}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Редагувати"><IconButton onClick={() => handleOpenForm(spec)} color="primary"><EditIcon /></IconButton></Tooltip>
                                        <Tooltip title="Видалити"><IconButton onClick={() => handleDeleteClick(spec.id)} color="error"><DeleteIcon /></IconButton></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <SpecializationForm open={formOpen} onClose={handleCloseForm} onSave={handleSaveSpec} specToEdit={editingSpec} />
            <ConfirmationDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={executeDelete} title="Підтвердити видалення" contentText="Ви впевнені? Видалення спеціалізації може вплинути на дані викладачів, які її використовують."/>
            <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification({ ...notification, open: false })}><Alert severity={notification.severity}>{notification.message}</Alert></Snackbar>
        </Container>
    );
}

export default SpecializationsPage;