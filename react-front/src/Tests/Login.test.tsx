import {fireEvent, render, screen} from '@testing-library/react';
import { Login } from '../Login/Login';


const url = 'http://127.0.0.1:5000/api/v1/user/login';
const body = { username: 'username-test', password: 'password-test' };

describe('Login', () => {
    test('should return token when response is successful', async () => {
        const mockResponse = { basic: 'token' };
        const mockFetch = jest.fn().mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce(mockResponse),
        });
        global.fetch = mockFetch;
        const result = await Login(url, body);
        expect(mockFetch).toHaveBeenCalledWith(url, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        expect(result).toEqual(mockResponse);
    })
    test('should throw error when response is not successful', async () => {
        const mockErrorResponse = { message: 'Error message' };
        const mockFetch = jest.fn().mockResolvedValueOnce({
          ok: false,
          json: jest.fn().mockResolvedValueOnce(mockErrorResponse),
        });
        global.fetch = mockFetch;
        await expect(Login(url, {})).rejects.toThrow('Error message');
    })
})
