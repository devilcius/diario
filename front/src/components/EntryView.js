import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEntry, deleteEntry, fetchCalendarEntries } from '../api/entries';
import { format } from 'date-fns';
import { t } from 'i18next';

const EntryView = () => {
    const { id } = useParams();
    const [entry, setEntry] = useState(null);
    const [adjacentEntries, setAdjacentEntries] = useState({ previous: null, next: null });
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        const [entryResponse, calendarEntries] = await Promise.all([
            fetchEntry(id),
            fetchCalendarEntries()
        ]);

        const currentEntryId = Number(id);
        const currentIndex = calendarEntries.findIndex((calendarEntry) => calendarEntry.id === currentEntryId);

        setAdjacentEntries({
            previous: currentIndex > 0 ? calendarEntries[currentIndex - 1] : null,
            next: currentIndex >= 0 && currentIndex < calendarEntries.length - 1 ? calendarEntries[currentIndex + 1] : null
        });

        const response = entryResponse;
        setEntry(response.data);
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);    

    const handleEdit = () => {
        navigate(`/entries/${id}/edit`);
    };

    const handleDelete = async () => {
        // Warn user before deleting with a confirmation dialog
        if (!window.confirm(t('entry.view.delete_confirm'))) {
            return;
        }        

        await deleteEntry(id);
        navigate('/');
    }

    const handleShowInCalendar = () => {
        if (!entry) {
            return;
        }

        navigate('/', {
            state: {
                view: 'calendar',
                focusDate: entry.entry_date,
                focusedEntryId: Number(id)
            }
        });
    };

    const handleShowInList = () => {
        navigate('/', { state: { view: 'list' } });
    };

    return (
        <Container className="entry-view-page">
            {entry && (
                <>
                    <button
                        type="button"
                        className="entry-side-nav entry-side-nav--prev"
                        onClick={() => adjacentEntries.previous && navigate(`/entries/${adjacentEntries.previous.id}`)}
                        disabled={!adjacentEntries.previous}
                        aria-label={t('entry.view.previous_entry')}
                    >
                        <span aria-hidden="true">←</span>
                        <span>{t('entry.view.previous_short')}</span>
                    </button>
                    <button
                        type="button"
                        className="entry-side-nav entry-side-nav--next"
                        onClick={() => adjacentEntries.next && navigate(`/entries/${adjacentEntries.next.id}`)}
                        disabled={!adjacentEntries.next}
                        aria-label={t('entry.view.next_entry')}
                    >
                        <span>{t('entry.view.next_short')}</span>
                        <span aria-hidden="true">→</span>
                    </button>
                    <div className="entry-header">
                        <div>
                            <p className="entry-header__eyebrow">{format(new Date(entry.entry_date), 'EEEE PP')}</p>
                            <h1 className="entry-header__title">{entry.title}</h1>
                            <p className="entry-header__subtitle">{t('entry.view.subtitle')}</p>
                        </div>
                        <div className="entry-header__actions">
                            <Button variant='outline-secondary' onClick={handleShowInCalendar}>
                                {t('entry.view.show_in_calendar')}
                            </Button>
                            <Button variant='outline-secondary' onClick={handleShowInList}>
                                {t('entry.view.show_in_list')}
                            </Button>
                        </div>
                    </div>
                    <div className="entry-view-card">
                        <div className="entry-view-card__content">
                            <ReactMarkdown>{entry.post}</ReactMarkdown>
                        </div>
                        <div className="entry-view-card__actions">
                            <Button variant='primary' className="entry-action-button entry-action-button--primary" onClick={handleEdit}>
                                {t('entry.view.edit_button')}
                            </Button>
                            <Button variant='danger' className="entry-action-button entry-action-button--danger" onClick={handleDelete}>
                                {t('entry.view.delete_button')}
                            </Button>
                        </div>
                    </div>
                    <div className="entry-mobile-nav">
                        <Button
                            variant="outline-secondary"
                            onClick={() => adjacentEntries.previous && navigate(`/entries/${adjacentEntries.previous.id}`)}
                            disabled={!adjacentEntries.previous}
                        >
                            {t('entry.view.previous_short')}
                        </Button>
                        <Button
                            variant="outline-secondary"
                            onClick={() => adjacentEntries.next && navigate(`/entries/${adjacentEntries.next.id}`)}
                            disabled={!adjacentEntries.next}
                        >
                            {t('entry.view.next_short')}
                        </Button>
                    </div>
                </>
            )}
        </Container>
    );
};

export default EntryView;
