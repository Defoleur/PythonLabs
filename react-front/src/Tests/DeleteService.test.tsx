import {fireEvent, render, screen} from '@testing-library/react';
import DeleteInfo from "../EventInfo/DeleteService";

const url = `http://127.0.0.1:5000/api/v1/event/2`;

describe('DeleteService', () => {
    test('should delete event when response is successful', async () => {
        window.sessionStorage.setItem("token", "basic-token")
        const mockResponse = { success: true };
        const mockFetch = jest.fn().mockResolvedValueOnce({
          ok: true,
             json: jest.fn().mockResolvedValueOnce(mockResponse)
        });
        global.fetch = mockFetch;
        const result = await DeleteInfo(url);
        expect(mockFetch).toHaveBeenCalledWith(url, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Basic basic-token`
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
        await expect(DeleteInfo(url)).rejects.toThrow('Error message');
    })
})
