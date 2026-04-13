import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEntry, saveEntry } from '../api/entries';
import { t } from 'i18next';

const EntryEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [post, setPost] = useState('');
    const [entryDate, setEntryDate] = useState('');

    const fetchData = useCallback(async () => {
        if (id) {
            const response = await fetchEntry(id);
            setTitle(response.data.title);
            setPost(response.data.post);
            const entryDate = new Date(response.data.entry_date);
            const utcDateString = new Date(Date.UTC(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate())).toISOString().split('T')[0];
            setEntryDate(utcDateString);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async (e) => {
        e.preventDefault();
        const entryData = {
            title,
            post,
            entry_date: new Date(entryDate).toISOString()
        };

        if (id) {
            await saveEntry(entryData, id);
            navigate(`/entries/${id}`);
        } else {
            await saveEntry(entryData);
            navigate('/');
        }
    };

    const handleShowInCalendar = () => {
        if (!entryDate) {
            navigate('/', { state: { view: 'calendar', focusedEntryId: Number(id) } });
            return;
        }

        const focusDate = new Date(entryDate).toISOString();
        navigate('/', {
            state: {
                view: 'calendar',
                focusDate,
                focusedEntryId: Number(id)
            }
        });
    };

    const handleViewEntry = () => {
        navigate(`/entries/${id}`);
    };

    return (
        <Container className="editor-page">
            <div className="entry-header">
                <div>
                    <p className="entry-header__eyebrow">
                        {id ? t('entry.edit.mode.editing') : t('entry.edit.mode.new')}
                    </p>
                    <h1 className="entry-header__title">
                        {id ? t('entry.edit.heading_existing') : t('entry.edit.heading_new')}
                    </h1>
                    <p className="entry-header__subtitle">{t('entry.edit.subtitle')}</p>
                </div>
                {id && (
                    <div className="entry-header__actions">
                        <Button variant="outline-secondary" onClick={handleShowInCalendar}>
                            {t('entry.edit.show_in_calendar')}
                        </Button>
                        <Button variant="outline-secondary" onClick={handleViewEntry}>
                            {t('entry.edit.view_entry')}
                        </Button>
                    </div>
                )}
            </div>
            <Form onSubmit={handleSave} className="entry-form">
                <Form.Group controlId="formTitle" className="entry-form__group">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formPost" className="entry-form__group">
                    <Form.Label>Post</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={25}
                        value={post}
                        onChange={(e) => setPost(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formEntryDate" className="entry-form__group">
                    <Form.Label>{t('entry.edit.entry_date')}</Form.Label>
                    <Form.Control
                        type="date"
                        value={entryDate}
                        onChange={(e) => setEntryDate(e.target.value)}
                    />
                </Form.Group>
                <div className="entry-form__footer">
                    <Button variant="primary" type="submit" className="entry-form__save">
                        {t('entry.edit.save_button')}
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default EntryEditor;
