import { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Grid } from '@mui/material';

const initialState = {
    full_name: '',
    date_of_birth: '',
    school: '',
    grade: '',
    birth_certificate_number: '',
    birth_certificate_date: '',
    address: '',
    phone: '',
    parent_info: ''
};

function StudentForm({ open, onClose, onSave, studentToEdit }) {
    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (studentToEdit) {
            setFormData({
                id: studentToEdit.id,
                full_name: studentToEdit.full_name || '',
                date_of_birth: studentToEdit.date_of_birth || '',
                school: studentToEdit.school || '',
                grade: studentToEdit.grade || '',
                birth_certificate_number: studentToEdit.birth_certificate_number || '',
                birth_certificate_date: studentToEdit.birth_certificate_date || '',
                address: studentToEdit.address || '',
                phone: studentToEdit.phone || '',
                parent_info: studentToEdit.parent_info || ''
            });
        } else {
            setFormData(initialState);
        }
    }, [studentToEdit, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{studentToEdit ? 'Редагувати дані учня' : 'Додати нового учня'}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <TextField name="full_name" label="ПІБ" value={formData.full_name} onChange={handleChange} fullWidth required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField name="date_of_birth" label="Дата народження" type="date" value={formData.date_of_birth} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField name="phone" label="Телефон" value={formData.phone} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField name="school" label="Школа" value={formData.school} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField name="grade" label="Клас" value={formData.grade} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField name="address" label="Адреса" value={formData.address} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField name="parent_info" label="Інформація про батьків" value={formData.parent_info} onChange={handleChange} fullWidth multiline rows={2} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Скасувати</Button>
                <Button onClick={handleSave} variant="contained">Зберегти</Button>
            </DialogActions>
        </Dialog>
    );
}

export default StudentForm;