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
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import GroupForm from '../modals/GroupForm.jsx';
import ConfirmationDialog from '../modals/ConfirmationDialog.jsx';
import GroupRosterModal from '../modals/GroupRosterModal.jsx';

function GroupsPage() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    
    const [formOpen, setFormOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);
    const [rosterModalOpen, setRosterModalOpen] = useState(false);
    const [selectedGroupForRoster, setSelectedGroupForRoster] = useState(null);

    async function fetchGroups() {
        setLoading(true);
        const { data, error } = await supabase.from('groups_with_details').select('*').order('name');

        if (error) {
            console.error('Error fetching groups:', error);
            setNotification({ open: true, message: `Помилка завантаження груп: ${error.message}`, severity: 'error' });
        } else {
            setGroups(data || []);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchGroups();
    }, []);

    
    const handleOpenForm = (group = null) => {
        setEditingGroup(group);
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setEditingGroup(null);
        setFormOpen(false);
    };

    const handleSaveGroup = async (formData) => {
        const { id, ...updateData } = formData;
        if (updateData.teacher_id === '') updateData.teacher_id = null;
        if (updateData.circle_id === '') updateData.circle_id = null;

        const result = id
            ? await supabase.from('groups').update(updateData).eq('id', id)
            : await supabase.from('groups').insert(updateData);

        if (result.error) {
            setNotification({ open: true, message: `Помилка збереження: ${result.error.message}`, severity: 'error' });
        } else {
            setNotification({ open: true, message: 'Групу успішно збережено!', severity: 'success' });
            handleCloseForm();
            fetchGroups();
        }
    };

    
    const handleDeleteClick = (groupId) => {
        setGroupToDelete(groupId);
        setConfirmOpen(true);
    };

    const executeDelete = async () => {
        const { error } = await supabase.from('groups').delete().eq('id', groupToDelete);
        if (error) {
            setNotification({ open: true, message: `Помилка видалення: ${error.message}`, severity: 'error' });
        } else {
            setNotification({ open: true, message: 'Групу успішно видалено.', severity: 'success' });
            fetchGroups(); 
        }
        setConfirmOpen(false);
        setGroupToDelete(null);
    };

    
    const handleOpenRoster = (group) => {
        setSelectedGroupForRoster(group);
        setRosterModalOpen(true);
    };

    const handleCloseRoster = () => {
        setSelectedGroupForRoster(null);
        setRosterModalOpen(false);
        fetchGroups();
    };

    const filteredGroups = useMemo(() => groups.filter(g =>
        g.name.toLowerCase().includes(filter.toLowerCase()) ||
        (g.circle_name && g.circle_name.toLowerCase().includes(filter.toLowerCase())) ||
        (g.teacher_name && g.teacher_name.toLowerCase().includes(filter.toLowerCase()))
    ), [groups, filter]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseNotification = (event, reason) => {
        if (reason === 'clickaway') return;
        setNotification({ ...notification, open: false });
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4">Керування групами</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
                    Створити групу
                </Button>
            </Box>
            <Paper sx={{ mb: 2, p: 2, borderRadius: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Пошук за назвою групи, гуртка або ім'ям викладача..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    InputProps={{
                        startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
                    }}
                />
            </Paper>
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Назва групи</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Гурток</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Керівник</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>К-сть учнів</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Дії</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredGroups.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((group) => (
                                <TableRow key={group.id} hover>
                                    <TableCell sx={{ fontWeight: 500 }}>
                                        <MuiLink component={RouterLink} to={`/groups/${group.id}`} underline="hover">
                                            {group.name}
                                        </MuiLink>
                                    </TableCell>
                                    <TableCell>{group.circle_name || '–'}</TableCell>
                                    <TableCell>{group.teacher_name || 'Не призначено'}</TableCell>
                                    <TableCell align="center">{group.student_count}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Керувати складом">
                                            <IconButton onClick={() => handleOpenRoster(group)} color="secondary"><PeopleAltIcon /></IconButton>
                                        </Tooltip>
                                        <Tooltip title="Редагувати групу">
                                            <IconButton onClick={() => handleOpenForm(group)} color="primary"><EditIcon /></IconButton>
                                        </Tooltip>
                                        <Tooltip title="Видалити групу">
                                            <IconButton onClick={() => handleDeleteClick(group.id)} color="error"><DeleteIcon /></IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredGroups.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Рядків на сторінці:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} з ${count}`}
                />
            </Paper>

            {/* Модальні вікна */}
            <GroupForm
                open={formOpen}
                onClose={handleCloseForm}
                onSave={handleSaveGroup}
                groupToEdit={editingGroup}
            />
            <ConfirmationDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={executeDelete}
                title="Підтвердити видалення"
                contentText="Ви впевнені, що хочете видалити цю групу? Всі пов'язані з нею зарахування учнів також будуть видалені. Ця дія незворотня."
            />
            {rosterModalOpen && (
                <GroupRosterModal
                    open={rosterModalOpen}
                    onClose={handleCloseRoster}
                    group={selectedGroupForRoster}
                />
            )}
            <Snackbar open={notification.open} autoHideDuration={4000} onClose={handleCloseNotification}>
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default GroupsPage;