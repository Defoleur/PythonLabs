import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import configureStore from 'redux-mock-store';
import {Provider} from "react-redux";
test('renders learn react link', () => {
  const initialState = { type: 'LOGOUT' };
    const mockStore = configureStore();
    let store;
    store = mockStore(initialState);
  render(<Provider store={store}><App /></Provider>);
  const linkElement = screen.getByText(/eventcd🗓️/i);
  expect(linkElement).toBeInTheDocument();
});
