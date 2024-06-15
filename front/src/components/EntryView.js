import React, { useState, useEffect, useCallback } from 'react';
import { Container, Button, ButtonGroup } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEntry, deleteEntry } from '../api/entries';
import { format } from 'date-fns';
import { t } from 'i18next';

const EntryView = () => {
    const { id } = useParams();
    const [entry, setEntry] = useState(null);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        const response = await fetchEntry(id);
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

    return (
        <Container>
            {entry && (
                <>
                    <h1>{entry.title}</h1>
                    <p>{format(new Date(entry.entry_date), 'PPpp')}</p>
                    <ReactMarkdown>{entry.post}</ReactMarkdown>
                    <ButtonGroup>
                        <Button variant='primary' className="mr-2" onClick={handleEdit}>{t('entry.view.edit_button')}</Button>
                        <Button variant='danger' onClick={handleDelete}>{t('entry.view.delete_button')}</Button>
                    </ButtonGroup>
                </>
            )}
        </Container>
    );
};

export default EntryView;