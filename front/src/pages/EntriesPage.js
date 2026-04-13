import React, { useEffect, useState } from 'react';
import { Container, ButtonGroup, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import EntryList from '../components/EntryList';
import CustomYearCalendar from '../components/CustomYearCalendar';
import { t } from 'i18next';

const EntriesPage = () => {
    const [view, setView] = useState('list');
    const [calendarFocusDate, setCalendarFocusDate] = useState(null);
    const [focusedEntryId, setFocusedEntryId] = useState(null);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.view) {
            setView(location.state.view);
        }

        if (location.state?.focusDate) {
            setCalendarFocusDate(location.state.focusDate);
        }

        if (location.state?.focusedEntryId) {
            setFocusedEntryId(location.state.focusedEntryId);
        }
    }, [location.state]);

    return (
        <Container className="entries-page">
            <div className="page-hero">
                <div>
                    <p className="page-hero__eyebrow">{t('entry.list.section_label')}</p>
                    <h1 className="page-hero__title">{t('entry-list-title')}</h1>
                    <p className="page-hero__subtitle">{t('entry.list.subtitle')}</p>
                </div>
                <ButtonGroup aria-label={t('entry.list.view_toggle_aria')} className="view-toggle">
                    <Button
                        variant={view === 'list' ? 'primary' : 'outline-secondary'}
                        onClick={() => setView('list')}
                    >
                        {t('entry.list.view_toggle.list')}
                    </Button>
                    <Button
                        variant={view === 'calendar' ? 'primary' : 'outline-secondary'}
                        onClick={() => setView('calendar')}
                    >
                        {t('entry.list.view_toggle.calendar')}
                    </Button>
                </ButtonGroup>
            </div>
            <div className="page-panel">
                {view === 'list' ? (
                    <EntryList />
                ) : (
                    <CustomYearCalendar
                        focusDate={calendarFocusDate}
                        focusedEntryId={focusedEntryId}
                    />
                )}
            </div>
        </Container>
    );
};

export default EntriesPage;
