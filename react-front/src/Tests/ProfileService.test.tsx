import {fireEvent, render, screen} from '@testing-library/react';
import {getProfile} from "../Profile/ProfileService";
import {IUser} from "../models";

const user : IUser = {
    id: 111,
    username: "svash1212",
    email: "svat000@gmail.com",
    firstName: "sviat",
    lastName: "string",
    phone: "3704241821",
    role: "user"
}

const url = `http://127.0.0.1:5000/api/v1/user/username`;

describe('ProfileService', () => {
    test('should return user when response is successful', async () => {
        window.sessionStorage.setItem("token", "basic-token")
        const mockResponse = user;
        const mockFetch = jest.fn().mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce(mockResponse),
        });
        global.fetch = mockFetch;
        const result = await getProfile(url);
        expect(mockFetch).toHaveBeenCalledWith(url, {
          method: 'GET',
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
        await expect(getProfile(url)).rejects.toThrow('Error message');
    })
})
