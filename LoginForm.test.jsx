// LoginForm.test.jsx
// Tests for the LoginForm component

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../components/LoginForm';

describe('LoginForm', () => {
  test('shows the input and button', () => {
    render(<LoginForm onLogin={() => {}} />);
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    expect(screen.getByText("Let's Play")).toBeInTheDocument();
  });

  test('calls onLogin with the name when button is clicked', () => {
    const mockLogin = jest.fn();
    render(<LoginForm onLogin={mockLogin} />);

    const input = screen.getByPlaceholderText('Your name');
    fireEvent.change(input, { target: { value: 'Jayden' } });

    const button = screen.getByText("Let's Play");
    fireEvent.click(button);

    expect(mockLogin).toHaveBeenCalledWith('Jayden');
  });

  test('trims whitespace from the name', () => {
    const mockLogin = jest.fn();
    render(<LoginForm onLogin={mockLogin} />);

    const input = screen.getByPlaceholderText('Your name');
    fireEvent.change(input, { target: { value: '  Alice  ' } });

    fireEvent.click(screen.getByText("Let's Play"));

    expect(mockLogin).toHaveBeenCalledWith('Alice');
  });

  test('shows error and does not call onLogin when name is empty', () => {
    const mockLogin = jest.fn();
    render(<LoginForm onLogin={mockLogin} />);

    fireEvent.click(screen.getByText("Let's Play"));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(screen.getByText('Please enter a name')).toBeInTheDocument();
  });
});
