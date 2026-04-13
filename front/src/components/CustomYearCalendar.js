import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchCalendarEntries } from '../api/entries';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';

const CustomYearlyCalendar = ({ focusDate, focusedEntryId }) => {
    const [entries, setEntries] = useState([]);
    const [markedDates, setMarkedDates] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [minYear, setMinYear] = useState(year);
    const [maxYear, setMaxYear] = useState(year);
    const navigate = useNavigate();
    const monthRefs = useRef([]);

    const focusedDateObject = useMemo(() => {
        return focusDate ? new Date(focusDate) : null;
    }, [focusDate]);

    const fetchEntryDates = useCallback(async () => {
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
            if (focusedDateObject) {
                setYear(focusedDateObject.getFullYear());
            } else {
                const currentYear = new Date().getFullYear();
                setYear(currentYear >= minDate.getFullYear() && currentYear <= maxDate.getFullYear() ? currentYear : minDate.getFullYear());
            }
        }
    }, [focusedDateObject]);

    useEffect(() => {
        fetchEntryDates();
    }, [fetchEntryDates]);

    useEffect(() => {
        if (!focusedDateObject) {
            return;
        }

        setYear(focusedDateObject.getFullYear());
    }, [focusedDateObject]);

    useEffect(() => {
        if (!focusedDateObject || focusedDateObject.getFullYear() !== year) {
            return;
        }

        const monthElement = monthRefs.current[focusedDateObject.getMonth()];
        if (monthElement) {
            monthElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [focusedDateObject, year]);

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
        <Container className="calendar-page">
            <div className="calendar-toolbar">
                <div>
                    <p className="calendar-toolbar__eyebrow">{t('calendar.section_label')}</p>
                    <h2 className="calendar-toolbar__title">{year}</h2>
                    <p className="calendar-toolbar__subtitle">{t('calendar.subtitle')}</p>
                </div>
                <div className="calendar-toolbar__actions">
                    <Button variant="outline-secondary" onClick={handlePrevYear} disabled={year <= minYear}>
                        {t('calendar.previous_year')}
                    </Button>
                    <Button variant="outline-secondary" onClick={handleNextYear} disabled={year >= maxYear}>
                        {t('calendar.next_year')}
                    </Button>
                </div>
            </div>
            <Row className="g-4">
                {months.map(month => (
                    <Col
                        key={month.getMonth()}
                        md={6}
                        xl={4}
                        ref={(element) => {
                            monthRefs.current[month.getMonth()] = element;
                        }}
                    >
                        <div className="calendar-month-card">
                            <div className="calendar-month-card__label">
                                {month.toLocaleString(undefined, { month: 'long' })}
                            </div>
                            <Calendar
                                value={focusedDateObject && focusedDateObject.getMonth() === month.getMonth() && focusedDateObject.getFullYear() === year ? focusedDateObject : month}
                                activeStartDate={month}
                                onClickDay={onDateClick}
                                tileContent={tileContent}
                                tileClassName={({ date, view }) => {
                                    if (view !== 'month') {
                                        return null;
                                    }

                                    const dateString = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0];
                                    const entry = getEntryForDate(dateString);
                                    const classes = [];

                                    if (markedDates.includes(dateString)) {
                                        classes.push('highlight');
                                    }

                                    if (entry && entry.id === focusedEntryId) {
                                        classes.push('highlight-selected');
                                    }

                                    return classes.join(' ') || null;
                                }}
                                view="month"
                                nextLabel={null}
                                next2Label={null}
                                prevLabel={null}
                                prev2Label={null}
                                showNeighboringMonth={false}
                                formatShortWeekday={(locale, date) =>
                                    date.toLocaleDateString(locale, { weekday: 'short' }).slice(0, 2)
                                }
                            />
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default CustomYearlyCalendar;
