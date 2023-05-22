import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import EventInfoPage from "../EventInfo/EventInfoPage";
import {IEvent, IUser} from "../models";
import {
    BrowserRouter as Router,
    Routes,
    Route, BrowserRouter,
} from "react-router-dom";
import getInfo from "../EventInfo/InfoService";
import AddUserToEvent from "../EventInfo/UserService";
import DeleteInfo from "../EventInfo/DeleteService";

jest.mock("../EventInfo/InfoService")
jest.mock("../EventInfo/UserService")
jest.mock("../EventInfo/DeleteService")


const mockGetEventInfo = jest.mocked(getInfo)
const mockGetUsersInfo = jest.mocked(getInfo)
const mockFindUser = jest.mocked(getInfo)
const mockAddUser = jest.mocked(AddUserToEvent)
const mockDeleteEvent = jest.mocked(DeleteInfo)
const mockDeleteUser = jest.mocked(DeleteInfo)

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
const users : IUser[] = [{
    id: 10,
    username: "svash",
    email: "svat000@gmail.com",
    firstName: "sviat",
    lastName: "string",
    phone: "3704241821",
    role: "user"
}, {
    id: 11,
    username: "defoleur",
    email: "svat001@gmail.com",
    firstName: "sviat1",
    lastName: "string12",
    phone: "3704241822",
    role: "admin"
}]

const foundUser : IUser = {
    id: 111,
    username: "svash1212",
    email: "svat000@gmail.com",
    firstName: "sviat",
    lastName: "string",
    phone: "3704241821",
    role: "user"
}

describe('EventInfoPage', () => {
    test('should show event when response was ok', async () => {
        mockGetEventInfo.mockResolvedValueOnce(event)
        mockGetUsersInfo.mockResolvedValueOnce(users)
        render(<EventInfoPage/>,{wrapper: Router})
        await waitFor(() => {
            expect(screen.getByLabelText('event-name')).toHaveTextContent(event.title);
            expect(screen.getByLabelText('username')).toHaveTextContent(event.username);
            expect(screen.getByLabelText('date')).toHaveTextContent(event.date);
            expect(screen.getByLabelText('time')).toHaveTextContent(`${event.startTime} - ${event.endTime}`);
            expect(screen.getByLabelText('description')).toHaveTextContent(event.content);
        })
    })
    test('should show list of users when response was ok', async () => {
        mockGetEventInfo.mockResolvedValueOnce(event)
        mockGetUsersInfo.mockResolvedValueOnce(users)
        render(<EventInfoPage/>,{wrapper: Router})
        await waitFor(() => {
            const userItems = screen.getAllByRole('listitem');
            expect(userItems).toHaveLength(users.length);
            users.forEach((user, index) => {
              const usernameElement = screen.getByText(`Username: ${user.username}`);
              expect(usernameElement).toBeInTheDocument();
            });
        })
    })
    test('should show user which was found when response was ok', async () => {
        mockGetEventInfo.mockResolvedValueOnce(event)
        mockGetUsersInfo.mockResolvedValueOnce(users)
        mockFindUser.mockResolvedValueOnce(foundUser)
        render(<EventInfoPage/>,{wrapper: Router})
        window.sessionStorage.setItem('username', event.username)
        await waitFor(() => {
            const button = screen.getByRole('button', {name: "Search!"})
            fireEvent.click(button)
        })
        await waitFor(() => {
            const button = screen.getByRole('button', {name: "+"})
            expect(button).toBeInTheDocument()
            const usernameElement = screen.getByText(`Username: ${foundUser.username}`);
            expect(usernameElement).toBeInTheDocument();
            const userItem = screen.getByLabelText('user-to-add')
            expect(userItem).toBeInTheDocument()
        })
    })
    test('should show error alert message when user was not found', async () => {
        mockGetEventInfo.mockResolvedValueOnce(event)
        mockGetUsersInfo.mockResolvedValueOnce(users)
        mockFindUser.mockRejectedValueOnce(new Error('User was not found!'));
        render(<EventInfoPage/>,{wrapper: Router})
        window.sessionStorage.setItem('username', event.username)
        await waitFor(() => {
            const button = screen.getByRole('button', {name: "Search!"})
            fireEvent.click(button)
        })
        const alertMessage = await screen.findByLabelText('error-label');
        expect(alertMessage).toBeInTheDocument();
        expect(alertMessage).toHaveTextContent("User with username wasn't found!");
    })
    test('should add found user when response was ok', async () => {
        mockGetEventInfo.mockResolvedValueOnce(event)
        mockGetUsersInfo.mockResolvedValueOnce(users)
        mockFindUser.mockResolvedValueOnce(foundUser);
        mockAddUser.mockResolvedValueOnce({})
        render(<EventInfoPage/>,{wrapper: Router})
        window.sessionStorage.setItem('username', event.username)
        await waitFor(() => {
            const button = screen.getByRole('button', {name: "Search!"})
            fireEvent.click(button)
        })
        await waitFor(() => {
            const button = screen.getByRole('button', {name: "+"})
            fireEvent.click(button)
            mockGetUsersInfo.mockResolvedValueOnce(users.push(foundUser))
            expect(mockAddUser).toHaveBeenCalledWith(
          `http://127.0.0.1:5000/api/v1/event/user`,
                {event: event.id, user: foundUser.id}
            );
        })
    })

    test('should delete user from list when delete button was clicked',async () => {
        mockGetEventInfo.mockResolvedValueOnce(event)
        mockGetUsersInfo.mockResolvedValueOnce(users)
        mockDeleteUser.mockResolvedValueOnce({})
        render(<EventInfoPage/>,{wrapper: Router})
        window.sessionStorage.setItem('username', event.username)
        await waitFor(() => {
            const deleteButtons = screen.getAllByText('-');
            fireEvent.click(deleteButtons[0]);
            mockGetUsersInfo.mockResolvedValueOnce(users)
            expect(mockDeleteUser).toBeCalledWith(`http://127.0.0.1:5000/api/v1/event/${event?.id}/${users[0].username}`)
        })
    })

    test('should delete event and navigate to events page when response was ok', async ()=>{
        mockGetEventInfo.mockResolvedValueOnce(event)
        mockGetUsersInfo.mockResolvedValueOnce(users)
        mockDeleteEvent.mockResolvedValueOnce({})
        render(<EventInfoPage/>,{wrapper: Router})
        window.sessionStorage.setItem('username', event.username)
        await waitFor(() => {
            const button = screen.getByRole('button', {name: "Delete this event!"})
            fireEvent.click(button)
               expect(mockDeleteEvent).toHaveBeenCalled();
        })
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/events');
        })
    })
})
