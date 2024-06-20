import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import EntryList from '../components/EntryList';
import CustomYearCalendar from '../components/CustomYearCalendar';
import { t } from 'i18next';

const EntriesPage = () => {
    const [view, setView] = useState('list');

    const toggleView = () => {
        setView(view === 'list' ? 'calendar' : 'list');
    };

    return (
        <Container>
            <h1>{t('entry-list-title')}</h1>
            <Button variant="secondary" onClick={toggleView}>
                {view === 'list' ? 'Switch to Calendar View' : 'Switch to List View'}
            </Button>
            {view === 'list' ? <EntryList /> : <CustomYearCalendar />}
        </Container>
    );
};

export default EntriesPage;