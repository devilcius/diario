import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const fetchEntries = async (search = '', page = 1) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/entries/`, {
        headers: {
            Authorization: `Token ${token}`
        },
        params: {
            post: search,
            page: page
        }
    });    

    return response.data;
}

const fetchEntry = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/entries/${id}/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response;
}

const saveEntry = async (entryData, id) => {
    const token = localStorage.getItem('token');
    if (id) {
        await axios.put(`${API_BASE_URL}/entries/${id}/`, entryData, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
    } else {
        await axios.post(`${API_BASE_URL}/entries/`, entryData, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
    }
}

const deleteEntry = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_BASE_URL}/entries/${id}/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
}

const fetchCalendarEntries = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/entry-dates/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
}

const fetchPreviousYearsEntries = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/previous-years-entries/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
}

export { fetchEntries, fetchEntry, saveEntry, deleteEntry, fetchCalendarEntries, fetchPreviousYearsEntries };