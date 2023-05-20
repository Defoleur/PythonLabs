import {fireEvent, render, screen, waitFor} from '@testing-library/react';

import RegistrationPage from "../Registration/RegistrationPage";
import {
    BrowserRouter as Router,
    Routes,
    Route, BrowserRouter,
} from "react-router-dom";
import React from "react";
import Registration from "../Registration/RegistrationService";

jest.mock("../Registration/RegistrationService")

const mockRegistration = jest.mocked(Registration);

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));


describe("RegistrationPage", () => {
    test('should show alert message when passwords are not the same', async () => {
        render(<RegistrationPage />,{wrapper: Router})
        const passwordInput = screen.getByLabelText('password') as HTMLInputElement;
        const confirmPasswordInput = screen.getByLabelText('confirm-password') as HTMLInputElement;
        fireEvent.change(passwordInput, {target: {value: 'password1'}})
        fireEvent.change(confirmPasswordInput, {target: {value: 'password2'}})
        const button = screen.getByRole('button', {name: "Register"})
        fireEvent.click(button)
        const alertMessage = await screen.findByLabelText('error-label');
        expect(alertMessage).toBeInTheDocument();
        expect(alertMessage).toHaveTextContent('Passwords are not the same!');
    })

    test('should show alert message when credentials are empty or wrong', async () => {
        mockRegistration.mockRejectedValueOnce(new Error('User was not created!'));
        render(<RegistrationPage />,{wrapper: Router})
        const button = screen.getByRole('button', {name: "Register"})
        fireEvent.click(button)
        const alertMessage = await screen.findByLabelText('error-label');
        expect(alertMessage).toBeInTheDocument();
        expect(alertMessage).toHaveTextContent('User was not created!');
    })

    test('should call registration function with provided data and show alert about user creation', async () => {
        mockRegistration.mockResolvedValueOnce({})
        render(<RegistrationPage />,{wrapper: Router})
        fireEvent.change(screen.getByLabelText('username'), {target: {value: 'admin'}})
        fireEvent.change(screen.getByLabelText('password'), {target: {value: 'password1'}})
        fireEvent.change(screen.getByLabelText('confirm-password'), {target: {value: 'password1'}})
        fireEvent.change(screen.getByLabelText('first-name'), {target: {value: 'Sviat'}})
        fireEvent.change(screen.getByLabelText('last-name'), {target: {value: 'Shainoha'}})
        fireEvent.change(screen.getByLabelText('email'), {target: {value: 'svat000@gmail.com'}})
        fireEvent.change(screen.getByLabelText('phone'), {target: {value: '38083482811'}})
        const button = screen.getByRole('button', {name: "Register"})
        fireEvent.click(button)
        const alertMock = jest.fn();
        Object.defineProperty(window, 'alert', { value: alertMock });
        expect(mockRegistration).toHaveBeenCalledWith(
          'http://127.0.0.1:5000/api/v1/user',
          {
        username: 'admin',
        password: 'password1',
        firstName: 'Sviat',
        lastName: 'Shainoha',
        email: 'svat000@gmail.com',
        phone: '38083482811'}
        );
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('User was successfully created. Please login now!');
    });
     expect(mockNavigate).toHaveBeenCalledWith('/login');
    })
})
