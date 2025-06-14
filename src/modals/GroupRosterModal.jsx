import { useState, useEffect } from 'react';
import { supabase } from '../DataBase/supabaseClient.js';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, List, ListItem, ListItemText,
    Typography, IconButton, CircularProgress, Divider, FormControl, Select, MenuItem, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function GroupRosterModal({ open, onClose, group }) {
    const [roster, setRoster] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [loading, setLoading] = useState(true);

    async function fetchRoster() {
        if (!group) return;
        setLoading(true);
        const { data: rosterData } = await supabase.from('enrollments').select('id, students(id, full_name)').eq('group_id', group.id).is('end_date', null);
        const currentStudentIds = rosterData.map(r => r.students.id);
        setRoster(rosterData || []);

        const { data: allStudentsData } = await supabase.from('students').select('id, full_name');
        setAvailableStudents(allStudentsData.filter(s => !currentStudentIds.includes(s.id)));
        setLoading(false);
    }

    useEffect(() => {
        if (open) {
            fetchRoster();
        }
    }, [open, group]);

    const handleAddStudent = async () => {
        if (!selectedStudent || !group) return;
        const { error } = await supabase.from('enrollments').insert({ student_id: selectedStudent, group_id: group.id, start_date: new Date() });
        if (!error) {
            setSelectedStudent('');
            fetchRoster();
        }
    };

    const handleRemoveStudent = async (enrollmentId) => {
        if (!window.confirm("Вилучити учня з групи?")) return;
        const { error } = await supabase.from('enrollments').update({ end_date: new Date() }).eq('id', enrollmentId);
        if (!error) {
            fetchRoster();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Керування складом групи: "{group?.name}"</DialogTitle>
            <DialogContent>
                {loading ? <CircularProgress /> : (
                    <>
                        <Typography variant="h6">Поточний склад</Typography>
                        {roster.length > 0 ? (
                            <List>{roster.map(r => <ListItem key={r.id} secondaryAction={<IconButton edge="end" onClick={() => handleRemoveStudent(r.id)}><DeleteIcon color="error" /></IconButton>}><ListItemText primary={r.students.full_name} /></ListItem>)}</List>
                        ) : <Alert severity="info" sx={{my: 1}}>У групі немає учнів</Alert>}

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6">Додати учня</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <FormControl fullWidth size="small" sx={{ mr: 1 }}>
                                <Select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} displayEmpty>
                                    <MenuItem value=""><em>-- Обрати учня --</em></MenuItem>
                                    {availableStudents.map(s => <MenuItem key={s.id} value={s.id}>{s.full_name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <Button onClick={handleAddStudent} variant="outlined" startIcon={<AddCircleOutlineIcon />} disabled={!selectedStudent}>Додати</Button>
                        </Box>
                    </>
                )}
            </DialogContent>
            <DialogActions><Button onClick={onClose}>Закрити</Button></DialogActions>
        </Dialog>
    );
}

export default GroupRosterModal;