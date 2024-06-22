import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchCalendarEntries } from '../api/entries';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CustomYearlyCalendar = () => {
    const [entries, setEntries] = useState([]);
    const [markedDates, setMarkedDates] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [minYear, setMinYear] = useState(year);
    const [maxYear, setMaxYear] = useState(year);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEntryDates();
    }, []);

    const fetchEntryDates = async () => {
        const response = await fetchCalendarEntries();
        setEntries(response);
        const dates = response.map(entry => new Date(entry.entry_date));
        setMarkedDates(dates.map(date => date.toISOString().split('T')[0]));

        // Calculate min and max years
        if (dates.length > 0) {
            const minDate = new Date(Math.min(...dates));
            const maxDate = new Date(Math.max(...dates));
            setMinYear(minDate.getFullYear());
            setMaxYear(maxDate.getFullYear());
            setYear(minDate.getFullYear());
        }
    };

    const getEntryForDate = (dateString) => {
        return entries.find(entry => new Date(entry.entry_date).toISOString().split('T')[0] === dateString);
    };

    const tileContent = ({ date, view }) => {
        const dateString = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0];
        if (view === 'month') {
            const entry = getEntryForDate(dateString);
            if (entry) {
                return (
                    <div
                        className="highlight"
                    ></div>
                );
            }
        }
        return null;
    };

    const onDateClick = (date) => {
        const clickedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0];
        const entry = getEntryForDate(clickedDate);
        if (entry) {
            navigate(`/entries/${entry.id}`);
        }
    };

    const handlePrevYear = () => {
        if (year > minYear) {
            setYear(year - 1);
        }
    };

    const handleNextYear = () => {
        if (year < maxYear) {
            setYear(year + 1);
        }
    };

    const months = [...Array(12).keys()].map(i => new Date(year, i, 1));

    return (
        <Container>
            <Row className="mb-3">
                <Col>
                    <Button variant="primary" onClick={handlePrevYear} disabled={year <= minYear}>Previous Year</Button>
                </Col>
                <Col className="text-center">
                    <h3>{year}</h3>
                </Col>
                <Col className="text-right">
                    <Button variant="primary" onClick={handleNextYear} disabled={year >= maxYear}>Next Year</Button>
                </Col>
            </Row>
            <Row>
                {months.map(month => (
                    <Col key={month.getMonth()} md={4} className="mb-3">
                        <Calendar
                            value={month}
                            onClickDay={onDateClick}
                            tileContent={tileContent}
                            tileClassName={({ date, view }) => {
                                const dateString = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0];
                                return markedDates.includes(dateString) ? 'highlight' : null;
                            }}
                            view="month"
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default CustomYearlyCalendar;