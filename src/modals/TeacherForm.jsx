import { useEffect, useState } from 'react';
import { supabase } from '../DataBase/supabaseClient.js';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Grid, Box, CircularProgress,
    FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Checkbox, ListItemText
} from '@mui/material';

const initialState = { full_name: '', date_of_birth: '', phone: '', address: '', education: '', marital_status: '', gender: '' };

function TeacherForm({ open, onClose, onSave, teacherToEdit }) {
    const [formData, setFormData] = useState(initialState);
    const [allSpecializations, setAllSpecializations] = useState([]);
    const [selectedSpecs, setSelectedSpecs] = useState([]);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        async function fetchData() {
            if (!open) return;
            setLoading(true);

            
            const { data: specData } = await supabase.from('specializations').select('id, name');
            setAllSpecializations(specData || []);

            
            if (teacherToEdit) {
                setFormData({ ...teacherToEdit, date_of_birth: teacherToEdit.date_of_birth || '' }); 
                const { data: currentSpecData } = await supabase.from('teacher_specializations').select('specialization_id').eq('teacher_id', teacherToEdit.id);
                setSelectedSpecs(currentSpecData ? currentSpecData.map(s => s.specialization_id) : []);
            } else {
                setFormData(initialState);
                setSelectedSpecs([]);
            }
            setLoading(false);
        }
        fetchData();
    }, [open, teacherToEdit]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSpecChange = (event) => {
        const { target: { value } } = event;
        setSelectedSpecs(typeof value === 'string' ? value.split(',') : value);
    };

    const handleSave = () => {
        
        onSave(formData, selectedSpecs);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{teacherToEdit ? 'Редагувати дані викладача' : 'Додати нового викладача'}</DialogTitle>
            <DialogContent>
                {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box> : (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}><TextField name="full_name" label="ПІБ" value={formData.full_name} onChange={handleChange} fullWidth required /></Grid>
                        <Grid item xs={12} sm={6}><TextField name="date_of_birth" label="Дата народження" type="date" value={formData.date_of_birth} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
                        <Grid item xs={12} sm={6}><TextField name="phone" label="Телефон" value={formData.phone} onChange={handleChange} fullWidth /></Grid>
                        <Grid item xs={12}><TextField name="address" label="Адреса" value={formData.address} onChange={handleChange} fullWidth /></Grid>
                        <Grid item xs={12}><TextField name="education" label="Освіта" value={formData.education} onChange={handleChange} fullWidth /></Grid>
                        {/* Поле для вибору кількох спеціалізацій */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Спеціалізації</InputLabel>
                                <Select
                                    multiple
                                    value={selectedSpecs}
                                    onChange={handleSpecChange}
                                    input={<OutlinedInput label="Спеціалізації" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map(id => {
                                                const spec = allSpecializations.find(s => s.id === id);
                                                return <Chip key={id} label={spec ? spec.name : ''} />;
                                            })}
                                        </Box>
                                    )}
                                >
                                    {allSpecializations.map((spec) => (
                                        <MenuItem key={spec.id} value={spec.id}>
                                            <Checkbox checked={selectedSpecs.indexOf(spec.id) > -1} />
                                            <ListItemText primary={spec.name} />
                                        </MenuItem>
                                    ))}
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

export default TeacherForm;