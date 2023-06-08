import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import UpdateEvent from "../EventInfo/UpdateService";
import {
    BrowserRouter as Router,
    Routes,
    Route, BrowserRouter,
} from "react-router-dom";
import getInfo from "../EventInfo/InfoService";
import {IEvent} from "../models";
import EventEditPage from "../EventInfo/EventEditPage";

jest.mock("../EventInfo/InfoService")
jest.mock("../EventInfo/UpdateService")

const mockGetEventInfo = jest.mocked(getInfo)
const mockUpdateEvent = jest.mocked(UpdateEvent)

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

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

describe('EventEditPage', () => {
     test('should show event info at inputs when response was ok', async () => {
        mockGetEventInfo.mockResolvedValueOnce(event)
        render(<EventEditPage/>,{wrapper: Router})
        await waitFor(() => {
            expect(screen.getByLabelText('title')).toHaveValue(event.title);
            expect(screen.getByLabelText('date')).toHaveValue(event.date);
            expect(screen.getByLabelText('start-time')).toHaveValue(event.startTime);
            expect(screen.getByLabelText('end-time')).toHaveValue(event.endTime);
            expect(screen.getByLabelText('content')).toHaveValue(event.content);
        })
    })
    test('should show alert message when data is incorrect and button was clicked', async () => {
        mockGetEventInfo.mockResolvedValueOnce(event)
        mockUpdateEvent.mockRejectedValueOnce(new Error("Date of this day is earlier than today"))
        render(<EventEditPage/>, {wrapper: Router})
        const button = screen.getByRole('button', {name: "Save!"})
        fireEvent.click(button)
        //expect(mockUpdateEvent).toHaveBeenCalledWith(`http://127.0.0.1:5000/api/v1/event/undefined`, event)
        const alertMessage = await screen.findByLabelText('error-label');
        expect(alertMessage).toBeInTheDocument();
        expect(alertMessage).toHaveTextContent('Date of this day is earlier than today');
        const closeButton = screen.getByRole('button', { name: 'Close alert' });
        fireEvent.click(closeButton);
        await waitFor(() => {
            const alertMessage = screen.queryByLabelText('error-label');
            expect(alertMessage).not.toBeInTheDocument();
        });
    })
    test('should navigate to event page when response was ok', async () => {
        mockGetEventInfo.mockResolvedValueOnce(event)
        mockUpdateEvent.mockResolvedValueOnce({message : "Event updated"})
        render(<EventEditPage/>, {wrapper: Router})
        const button = screen.getByRole('button', {name: "Save!"})
        fireEvent.click(button)
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
        })
    })
    test('should change event info when input was changed', async () => {
        mockGetEventInfo.mockResolvedValueOnce(event)
        render(<EventEditPage/>,{wrapper: Router})
        fireEvent.change(screen.getByLabelText('title'), {target: {value: "Some new title"}})
        await waitFor(() => {
            expect(screen.getByLabelText('title')).toHaveValue("Some new title");
        })
    })
})
