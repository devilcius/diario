import React, { useState, useEffect } from 'react';
import { Table, FormControl, Container, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchEntries } from '../api/entries';
import { format } from 'date-fns';
import { t } from 'i18next';

const EntryList = () => {
    const [entries, setEntries] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);    

    useEffect(() => {
        fetchData(search, currentPage);
    }, [search, currentPage]);

    const fetchData = async (search, page) => {
        const response = await fetchEntries(search, page);
        setEntries(response.results);
        setTotalPages(Math.ceil(response.count / 10)); // Assuming PAGE_SIZE is 10
    };

    const handleSearch = (event) => {
        const { value } = event.target;
        setSearch(value);
        setCurrentPage(1); // Reset to first page on new search
    }
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderPaginationItems = () => {
        let items = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            items.push(<Pagination.Item key={1} onClick={() => handlePageChange(1)}>{1}</Pagination.Item>);
            if (startPage > 2) {
                items.push(<Pagination.Ellipsis key="startEllipsis" disabled />);
            }
        }

        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => handlePageChange(page)}
                >
                    {page}
                </Pagination.Item>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(<Pagination.Ellipsis key="endEllipsis" disabled />);
            }
            items.push(<Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>{totalPages}</Pagination.Item>);
        }

        return items;
    };

    if(!entries) {
        return <p>{ t('general.loading') }</p>;
    }

    return (
        <Container>
            <FormControl
                type="search"
                placeholder={ t('entry.list.search') }
                className="mb-3"
                value={search}
                onChange={handleSearch}
            />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>{ t('entry.list.table.title') }</th>
                        <th>{ t('entry.list.table.date') }</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry) => (
                        <tr key={entry.id}>
                            <td>
                                <Link to={`/entries/${entry.id}`}>{entry.title}</Link>
                            </td>
                            <td>{format(new Date(entry.entry_date), 'PPpp')}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination>
                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {renderPaginationItems()}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>         
        </Container>
    );
};

export default EntryList;