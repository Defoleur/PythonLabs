import {fireEvent, render, screen} from '@testing-library/react';
import Registration from "../Registration/RegistrationService";


const url = 'http://127.0.0.1:5000/api/v1/user';
const body = {
        username: 'admin',
        password: 'password1',
        firstName: 'Sviat',
        lastName: 'Shainoha',
        email: 'svat000@gmail.com',
        phone: '38083482811'};

describe('Registration', () => {
    test('should return ok when response is successful', async () => {
        const mockResponse = {};
        const mockFetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockResponse),
        });
        global.fetch = mockFetch;
        const result = await Registration(url, body);
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
        await expect(Registration(url, body)).rejects.toThrow('Error message');
    })
})
