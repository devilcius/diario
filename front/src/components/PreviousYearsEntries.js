import React, { useState, useEffect } from 'react';
import { fetchPreviousYearsEntries } from '../api/entries';
import { Container, ListGroup, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const PreviousYearsEntries = () => {
    const [entries, setEntries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        const data = await fetchPreviousYearsEntries();
        setEntries(data);
    };

    const groupEntriesByYear = (entries) => {
        const groupedEntries = entries.reduce((acc, entry) => {
            const year = new Date(entry.entry_date).getFullYear();
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(entry);
            return acc;
        }, {});
        return groupedEntries;
    };

    const groupedEntries = groupEntriesByYear(entries);

    const handleEdit = (id) => {
        navigate(`/entries/${id}/edit`);
    };

    return (
        <Container>
            <h1>Entries for Previous Years on This Day</h1>
            {Object.keys(groupedEntries).sort((a, b) => b - a).map(year => (
                <div key={year}>
                    <h2>{year}</h2>
                    <ListGroup>
                        {groupedEntries[year].map(entry => (
                            <ListGroup.Item key={entry.id}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5>{entry.title}</h5>
                                        <p>{format(new Date(entry.entry_date), 'EEEE PP')}</p>
                                        <ReactMarkdown>{entry.post}</ReactMarkdown>
                                        <Button variant="primary" onClick={() => handleEdit(entry.id)}>Edit</Button>
                                    </div>                                    
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            ))}
        </Container>
    );
};

export default PreviousYearsEntries;