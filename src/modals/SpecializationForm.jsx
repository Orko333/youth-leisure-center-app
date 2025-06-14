import { useEffect, useState } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Grid
} from '@mui/material';

function SpecializationForm({ open, onClose, onSave, specToEdit }) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (specToEdit) {
            setName(specToEdit.name || '');
        } else {
            setName('');
        }
    }, [specToEdit, open]);

    const handleSave = () => {
        if (name.trim()) {
            
            onSave({ id: specToEdit?.id, name: name.trim() });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{specToEdit ? 'Редагувати спеціалізацію' : 'Додати нову спеціалізацію'}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            name="name"
                            label="Назва спеціалізації"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            required
                        />
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

export default SpecializationForm;