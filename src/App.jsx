import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Typography } from '@mui/material';

import { theme } from './components/theme.js';
import Layout from './components/Layout';
import HomePage from './pages/HomePage.jsx';
import GroupsPage from './pages/GroupsPage.jsx';
import StudentsPage from './pages/StudentsPage.jsx';
import StudentProfilePage from './pages/StudentProfilePage.jsx';
import GroupProfilePage from './pages/GroupProfilePage.jsx';
import TeachersPage from './pages/TeachersPage.jsx';
import TeacherProfilePage from './pages/TeacherProfilePage.jsx';
import SpecializationsPage from './pages/SpecializationsPage.jsx';

function App() {
    return (
        <ThemeProvider theme={theme}><Router><Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="groups" element={<GroupsPage />} />
                <Route path="groups/:groupId" element={<GroupProfilePage />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="students/:studentId" element={<StudentProfilePage />} />
                <Route path="teachers" element={<TeachersPage />} />
                <Route path="teachers/:teacherId" element={<TeacherProfilePage />} />
                <Route path="specializations" element={<SpecializationsPage />} />
                <Route path="*" element={<Typography variant="h4" align="center" sx={{ mt: 5 }}>404: Сторінку не знайдено</Typography>} />
            </Route>
        </Routes></Router></ThemeProvider>
    );
}
export default App;