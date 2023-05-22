import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import CreateEventPage from "../CreateEvent/CreateEventPage";
import CreateEvent from "../CreateEvent/CreateEventService";
import {
    BrowserRouter as Router,
    Routes,
    Route, BrowserRouter,
} from "react-router-dom";
import {IEvent} from "../models";

const event : IEvent = {
    id: 0,
    title: "Test event",
    content: "Some event description",
    date: "2023-09-22",
    startTime: "18:00",
    endTime: "19:30",
    user_id: 0,
    username: ""
}

jest.mock("../CreateEvent/CreateEventService")
const mockCreateEvent = jest.mocked(CreateEvent)

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('CreateEventPage',() => {
    test('should create event with provided data and redirect to page when button was clicked', async () => {
        mockCreateEvent.mockResolvedValueOnce({})
        render(<CreateEventPage/>, {wrapper: Router})
        fireEvent.change(screen.getByLabelText('title'), {target: {value: event.title}})
        fireEvent.change(screen.getByLabelText('date'), {target: {value: event.date}})
        fireEvent.change(screen.getByLabelText('start-time'), {target: {value: event.startTime}})
        fireEvent.change(screen.getByLabelText('end-time'), {target: {value: event.endTime}})
        fireEvent.change(screen.getByLabelText('content'), {target: {value: event.content}})
        const button = screen.getByRole('button', {name: "Save!"})
        fireEvent.click(button)
        expect(mockCreateEvent).toHaveBeenCalledWith(
          'http://127.0.0.1:5000/api/v1/event',
          event
        );
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/events');
        })
    })
    test('should show alert message when data is incorrect and button was clicked', async () => {
        mockCreateEvent.mockRejectedValueOnce(new Error("Date of this day is earlier than today"))
        render(<CreateEventPage/>, {wrapper: Router})
        const button = screen.getByRole('button', {name: "Save!"})
        fireEvent.click(button)
        const alertMessage = await screen.findByLabelText('error-label');
        expect(alertMessage).toBeInTheDocument();
        expect(alertMessage).toHaveTextContent('Date of this day is earlier than today');
    })
})
