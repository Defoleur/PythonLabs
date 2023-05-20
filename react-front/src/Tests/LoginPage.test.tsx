import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import LoginPage from "../Login/LoginPage";
import {
    BrowserRouter as Router,
    Routes,
    Route, BrowserRouter,
} from "react-router-dom";
import {Login} from "../Login/Login";
jest.mock("../Login/Login")

const mockLogin = jest.mocked(Login);

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe("LoginPage", () => {
    beforeAll(() => {
        const sessionStorageMock = {
          getItem: jest.fn(),
          setItem: jest.fn(),
          removeItem: jest.fn(),
          clear: jest.fn(),
        };
        Object.defineProperty(window, 'sessionStorage', {
          value: sessionStorageMock,
          writable: true,
    });
         });
    test('should contain username text', () => {
        render(<LoginPage/>,{wrapper: Router})
        expect(screen.getByText(/username/i)).toBeInTheDocument()
    })
    // test('default snapshot test', () => {
    //     const page = render(<LoginPage/>,{wrapper: Router})
    //     expect(page).toMatchSnapshot()
    // })
    test('should update the username and password values when changed', () => {
        render(<LoginPage />,{wrapper: Router})
        const usernameInput = screen.getByLabelText('username') as HTMLInputElement;
        const passwordInput = screen.getByLabelText('password') as HTMLInputElement;
        fireEvent.change(usernameInput, {target: {value: 'admin'}})
        fireEvent.change(passwordInput, {target: {value: 'admin'}})
        expect(usernameInput.value).toBe('admin')
        expect(passwordInput.value).toBe('admin')
    })

    test('should show alert message when click button and credentials are empty or wrong', async() => {
        mockLogin.mockRejectedValueOnce(new Error('Invalid password or username specified'));
        render(<LoginPage />,{wrapper: Router})
        const button = screen.getByRole('button', {name: "Login"})
            //screen.getByTestId('login-button')
        fireEvent.click(button)
        const alertMessage = await screen.findByLabelText('error-label');
        expect(alertMessage).toBeInTheDocument();
        expect(alertMessage).toHaveTextContent('Invalid password or username specified');
    })

    test('should store data in session storage and redirect to profile page when button was clicked and credentials are correct', async () => {
        mockLogin.mockResolvedValueOnce({ basic: 'token' });
        render(<LoginPage />,{wrapper: Router});
        const usernameInput = screen.getByLabelText('Username:');
        const passwordInput = screen.getByLabelText('Password:');
        const loginButton = screen.getByText('Login');

        fireEvent.change(usernameInput, { target: { value: 'admin' } });
        fireEvent.change(passwordInput, { target: { value: 'admin' } });
        fireEvent.click(loginButton);

        expect(mockLogin).toHaveBeenCalledWith(
          'http://127.0.0.1:5000/api/v1/user/login',
          { username: 'admin', password: 'admin' }
        );
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/profile');
        })
    })
})
