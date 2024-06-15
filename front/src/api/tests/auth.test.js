import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { login, logout  } from '../auth';

const mockAdapter = new MockAdapter(axios);

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

describe('Auth Service', () => {
    beforeEach(() => {
        mockAdapter.reset();
    });

    it('successfully logs in and fetches user details', async () => {
        const tokenResponse = { token: 'fakeToken' };

        // Mock the login response
        mockAdapter.onPost(`${API_BASE_URL}/token-auth/`).reply(200, tokenResponse);

        const response = await login('testuser', 'password');

        // Expect the login to be successful
        expect(response.loginResponse.data).toEqual(tokenResponse);;
    });

    it('handles login error and does not fetch user details', async () => {
        const mockData = { error: 'Invalid credentials' };
        // Mock the login response to return an error
        mockAdapter.onPost(`${API_BASE_URL}/token-auth/`).reply(401, mockData);

        const response = await login('testuser', 'password');
        // Expect the login to fail
        expect(response.data).toEqual(mockData);
        // Check that user details were not attempted to be fetched and no data is stored
        expect(localStorage.getItem('token')).toBeNull();
    });

    it('successfully logs out', () => {
        localStorage
            .setItem('token', 'fakeToken');

        logout();

        // Check that the token was removed
        expect(localStorage.getItem('token')).toBeNull();
    });

    it('successfully logs out and calls callback', () => {
        localStorage
            .setItem('token', 'fakeToken');

        const mockCallback = jest.fn();
        logout(mockCallback);

        // Check that the token was removed
        expect(localStorage.getItem('token')).toBeNull();
        // Check that the callback was called
        expect(mockCallback).toHaveBeenCalled();
    });
});