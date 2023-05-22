import {fireEvent, render, screen} from '@testing-library/react';
import getInfo from "../EventInfo/InfoService";
import {IEvent} from "../models";

const event : IEvent = {
    id: 2,
    title: "Test event",
    content: "Some event description",
    date: "2023-09-22",
    startTime: "18:00",
    endTime: "19:30",
    user_id: 6,
    username: "admin",
}

const url = `http://127.0.0.1:5000/api/v1/event/2`;

describe('Info service', () => {
    test('should return event when response is successful', async () => {
        window.sessionStorage.setItem("token", "basic-token")
        const mockResponse = event;
        const mockFetch = jest.fn().mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce(mockResponse),
        });
        global.fetch = mockFetch;
        const result = await getInfo(url);
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
        await expect(getInfo(url)).rejects.toThrow('Error message');
    })
})
