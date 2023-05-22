import {fireEvent, render, screen} from '@testing-library/react';
import {getUsers} from "../Admin/UsersService";
import {IUser} from "../models";

const user : IUser[] = [{
    id: 111,
    username: "svash1212",
    email: "svat000@gmail.com",
    firstName: "sviat",
    lastName: "string",
    phone: "3704241821",
    role: "user"
},
{
    id: 112,
    username: "svas12h1212",
    email: "svat01@gmail.com",
    firstName: "sviat",
    lastName: "string",
    phone: "3704242221",
    role: "user"
}]

const url = `http://127.0.0.1:5000/api/v1/user/users`;

describe('UsersService', () => {
    test('should return users when response is successful', async () => {
        window.sessionStorage.setItem("token", "basic-token")
        const mockResponse = user;
        const mockFetch = jest.fn().mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce(mockResponse),
        });
        global.fetch = mockFetch;
        const result = await getUsers(url);
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
        await expect(getUsers(url)).rejects.toThrow('Error message');
    })
})
