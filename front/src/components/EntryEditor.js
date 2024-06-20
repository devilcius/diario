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
            setEntryDate(new Date(response.data.entry_date).toISOString().slice(0, 16));
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

    return (
        <Container>
            <Form onSubmit={handleSave}>
                <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formPost">
                    <Form.Label>Post</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={10}
                        value={post}
                        onChange={(e) => setPost(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formEntryDate">
                    <Form.Label>{t('entry.edit.entry_date')}</Form.Label>
                    <Form.Control
                        type="date"
                        value={entryDate}
                        onChange={(e) => setEntryDate(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    {t('entry.edit.save_button')}
                </Button>
            </Form>
        </Container>
    );
};

export default EntryEditor;