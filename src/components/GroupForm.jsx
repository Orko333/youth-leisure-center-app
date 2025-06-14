import { useEffect, useState } from 'react';
import { supabase } from '../DataBase/supabaseClient.js';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Grid,
    FormControl, InputLabel, Select, MenuItem, CircularProgress, Box
} from '@mui/material';

const initialState = { name: '', circle_id: '', teacher_id: '' };

function GroupForm({ open, onClose, onSave, groupToEdit }) {
    const [formData, setFormData] = useState(initialState);
    const [circles, setCircles] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDropdownData() {
            setLoading(true);
            const { data: circlesData } = await supabase.from('circles').select('id, name');
            const { data: teachersData } = await supabase.from('teachers').select('id, full_name');
            setCircles(circlesData || []);
            setTeachers(teachersData || []);
            setLoading(false);
        }
        if (open) {
            fetchDropdownData();
        }
    }, [open]);

    useEffect(() => {
        if (groupToEdit) {
            setFormData({
                id: groupToEdit.id,
                name: groupToEdit.name || '',
                circle_id: groupToEdit.circle_id || '',
                teacher_id: groupToEdit.teacher_id || '',
            });
        } else {
            setFormData(initialState);
        }
    }, [groupToEdit, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => onSave(formData);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{groupToEdit ? 'Редагувати групу' : 'Створити нову групу'}</DialogTitle>
            <DialogContent>
                {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box> : (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField name="name" label="Назва групи" value={formData.name} onChange={handleChange} fullWidth required />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Гурток/Студія</InputLabel>
                                <Select name="circle_id" value={formData.circle_id} label="Гурток/Студія" onChange={handleChange}>
                                    {circles.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Викладач-керівник</InputLabel>
                                <Select name="teacher_id" value={formData.teacher_id} label="Викладач-керівник" onChange={handleChange}>
                                    {teachers.map(t => <MenuItem key={t.id} value={t.id}>{t.full_name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Скасувати</Button>
                <Button onClick={handleSave} variant="contained" disabled={loading}>Зберегти</Button>
            </DialogActions>
        </Dialog>
    );
}

export default GroupForm;