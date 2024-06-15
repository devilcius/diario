import { React } from 'react';
import { Route, Routes } from 'react-router-dom';
import EntriesPage from '../pages/EntriesPage';
import EntryView from '../components/EntryView';
import EntryEditor from '../components/EntryEditor';
import Login from '../components/Login';

const AppRoutes = ({ isAuthenticated }) => {

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/entries/:id?" element={isAuthenticated ? <EntryView /> : <Login />} />
            <Route path="/" element={isAuthenticated ? <EntriesPage /> : <Login />} />
            <Route path="/entries/:id?/edit" element={isAuthenticated ? <EntryEditor /> : <Login />} />
        </Routes>
    );
};

export default AppRoutes;