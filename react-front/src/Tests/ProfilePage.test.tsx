import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import ProfilePage from "../Profile/ProfilePage";

import {
    BrowserRouter as Router,
    Routes,
    Route, BrowserRouter,
} from "react-router-dom";

const user : IUser = {
    id: 111,
    username: "svash1212",
    email: "svat000@gmail.com",
    firstName: "sviat",
    lastName: "string",
    phone: "3704241821",
    role: "user"
}

import {getProfile} from "../Profile/ProfileService";
import {IUser} from "../models";
import configureStore from "redux-mock-store";
jest.mock("../Profile/ProfileService")
const mockGetProfile = jest.mocked(getProfile)
const initialState = { type: 'LOGOUT' };
const mockStore = configureStore();
import {Provider} from "react-redux";
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch
}));

describe('ProfilePage', () => {
    test('should show profile info when response was ok', async () => {
        mockGetProfile.mockResolvedValueOnce(user)
        let store;
        store = mockStore(initialState);
        window.sessionStorage.setItem('username', user.username)
        render(<Provider store={store}><ProfilePage/></Provider>,{wrapper: Router})
        expect(mockGetProfile).toHaveBeenCalledWith(
          `http://127.0.0.1:5000/api/v1/user/${user.username}`
            );
        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOGIN' });
            expect(screen.getByLabelText('name')).toHaveTextContent(`${user.firstName} ${user.lastName}`);
            expect(screen.getByLabelText('username-profile')).toHaveTextContent(user.username);
            expect(screen.getByLabelText('email')).toHaveTextContent(user.email);
            expect(screen.getByLabelText('phone')).toHaveTextContent(user.phone);
            expect(screen.getByLabelText('role')).toHaveTextContent(user.role);
        })
    })
    test('should set LOGOUT at redux and clear session storage when click logout button', async () => {
        mockGetProfile.mockResolvedValueOnce(user)
        let store;
        store = mockStore(initialState);
        window.sessionStorage.setItem('username', user.username)
        render(<Provider store={store}><ProfilePage/></Provider>,{wrapper: Router})
        await waitFor(() => {
            const button = screen.getByRole('button', {name: "Logout!"})
            fireEvent.click(button)
            expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOGOUT' });
            expect(window.sessionStorage.getItem('username')).not.toBe(user.username)
        })
    })
})
