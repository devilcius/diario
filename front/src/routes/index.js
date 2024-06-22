import { React } from 'react';
import { Route, Routes } from 'react-router-dom';
import EntriesPage from '../pages/EntriesPage';
import EntryView from '../components/EntryView';
import EntryEditor from '../components/EntryEditor';
import PreviousYearsEntries from '../components/PreviousYearsEntries';
import Login from '../components/Login';

const AppRoutes = ({ isAuthenticated }) => {

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/entries/:id?" element={isAuthenticated ? <EntryView /> : <Login />} />
            <Route path="/" element={isAuthenticated ? <EntriesPage /> : <Login />} />
            <Route path="/entries/:id?/edit" element={isAuthenticated ? <EntryEditor /> : <Login />} />
            <Route path="/previous-years-entries" element={isAuthenticated ? <PreviousYearsEntries /> : <Login />} />
        </Routes>
    );
};

export default AppRoutes;