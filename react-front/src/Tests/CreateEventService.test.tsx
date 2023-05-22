import {fireEvent, render, screen} from '@testing-library/react';
import CreateEvent from "../CreateEvent/CreateEventService";
import {IEvent} from "../models";

const event : IEvent = {
    id: 0,
    title: "Test event",
    content: "Some event description",
    date: "2023-09-22",
    startTime: "18:00",
    endTime: "19:30",
    user_id: 0,
    username: "",
}
const url = 'http://127.0.0.1:5000/api/v1/event';

describe('CreateEventService', () => {
    test('should return success of creating event when response is successful', async () => {
        window.sessionStorage.setItem("token", "basic-token")
        const mockResponse = { success: true };
        const mockFetch = jest.fn().mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce(mockResponse),
        });
        global.fetch = mockFetch;
        const result = await CreateEvent(url, event);
        expect(mockFetch).toHaveBeenCalledWith(url, {
          method: 'POST',
          body: JSON.stringify(event),
          headers: {
              Authorization: `Basic ${sessionStorage.getItem('token')}`,
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
        await expect(CreateEvent(url, {})).rejects.toThrow('Error message');
    })
})
