import {fireEvent, render, screen} from '@testing-library/react';
import {IUser} from "../models";
import AddUserToEvent from "../EventInfo/UserService";

const attachUser = {
    user_id: 10,
    event_id: 15
}

const url = `http://127.0.0.1:5000/api/v1/event/user`;

describe('UserService', () => {
    test('should add user to event when response is successful', async () => {
        window.sessionStorage.setItem("token", "basic-token")
        const mockResponse = attachUser;
        const mockFetch = jest.fn().mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce(mockResponse),
        });
        global.fetch = mockFetch;
        const result = await AddUserToEvent(url, attachUser);
        expect(result).toEqual(mockResponse);
        expect(mockFetch).toHaveBeenCalledWith(url, {
          method: 'POST',
             body: JSON.stringify(attachUser),
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
        await expect(AddUserToEvent(url, attachUser)).rejects.toThrow('Error message');
    })
})
