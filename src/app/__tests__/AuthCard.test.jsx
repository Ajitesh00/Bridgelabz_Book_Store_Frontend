// Import React and testing utilities from React Testing Library
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// Import Jest DOM for custom assertions like toBeInTheDocument
import '@testing-library/jest-dom';
import AuthCard from '../components/AuthCard';

// Mock the user service functions to prevent actual API calls during testing
jest.mock('../services/user.service', () => ({
  loginUser: jest.fn(), // Mock loginUser function
  registerUser: jest.fn(), // Mock registerUser function
}));

// Import mocked functions for use in tests
import { loginUser, registerUser } from '../services/user.service';

// Describe block for grouping all AuthCard component tests
describe('AuthCard Component', () => {
  // Clear all mocks before each test to ensure a clean state
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test that the login view is rendered by default
  test('renders login view by default', () => {
    // Render the AuthCard component with role="user"
    render(<AuthCard role="user" />);
    // Find all elements with "LOGIN" text (case-insensitive) and use the first one
    const loginElements = screen.getAllByText(/LOGIN/i);
    expect(loginElements[0]).toBeInTheDocument(); // Check if LOGIN tab is present
    expect(screen.getByText(/SIGNUP/i)).toBeInTheDocument(); // Check if SIGNUP tab is present
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument(); // Check if Login button is present
  });

  // Test switching to signup view when clicking the SIGNUP tab
  test('switches to signup view when clicking signup tab', () => {
    render(<AuthCard role="user" />);
    // Simulate clicking the SIGNUP tab
    fireEvent.click(screen.getByText(/SIGNUP/i));
    // Check if Signup button is rendered
    expect(screen.getByRole('button', { name: /Signup/i })).toBeInTheDocument();
    // Check if Full Name input field is present in signup view
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
  });

  // Test that an error is shown when login is attempted with empty fields
  test('shows error when email and password are empty', async () => {
    render(<AuthCard role="user" />);
    // Simulate clicking the Login button without filling fields
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    // Wait for and verify the error message in the snackbar
    expect(await screen.findByText(/Email and Password are required/i)).toBeInTheDocument();
  });

  // Test successful login submission
  test('calls loginUser on login submit', async () => {
    // Mock loginUser to resolve with a successful response
    loginUser.mockResolvedValue({
      data: { code: 200, message: 'Login successful', data: { token: 'abc123' } },
    });

    render(<AuthCard role="user" />);
    // Simulate entering email and password
    fireEvent.change(screen.getByLabelText('Email Id'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    // Simulate clicking the Login button
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Wait for the loginUser call and verify parameters
    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith('user', {
        email: 'test@example.com',
        password: 'password123',
      });
    });

    // Verify success message in the snackbar
    expect(await screen.findByText(/Login successful/i)).toBeInTheDocument();
  });

  // Test successful signup submission
  test('calls registerUser on signup submit', async () => {
    // Mock registerUser to resolve with a successful response
    registerUser.mockResolvedValue({
      data: { code: 200, message: 'Signup successful' },
    });

    render(<AuthCard role="user" />);
    // Switch to signup view
    fireEvent.click(screen.getByText(/SIGNUP/i));
    // Simulate entering form fields
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email Id'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'mypassword' } });
    fireEvent.change(screen.getByLabelText('Mobile Number'), { target: { value: '1234567890' } });
    // Simulate clicking the Signup button
    fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

    // Wait for the registerUser call and verify parameters
    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith('user', {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'mypassword',
      });
    });

    // Verify success message in the snackbar
    expect(await screen.findByText(/Signup successful/i)).toBeInTheDocument();
  });

  // Test error when full name is empty during signup
  test('shows error when full name is empty during signup', async () => {
    render(<AuthCard role="user" />);
    // Switch to signup view
    fireEvent.click(screen.getByText(/SIGNUP/i));

    // Simulate entering all fields except full name
    fireEvent.change(screen.getByLabelText('Email Id'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Mobile Number'), { target: { value: '1234567890' } });

    // Simulate clicking the Signup button
    fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

    // Verify error message for missing full name
    expect(await screen.findByText(/Full Name is required/i)).toBeInTheDocument();
    // Ensure registerUser was not called
    expect(registerUser).not.toHaveBeenCalled();
  });

  // Test error when mobile number is empty during signup
  test('shows error when mobile number is empty during signup', async () => {
    render(<AuthCard role="user" />);
    // Switch to signup view
    fireEvent.click(screen.getByText(/SIGNUP/i));

    // Simulate entering all fields except mobile number
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email Id'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

    // Simulate clicking the Signup button
    fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

    // Verify error message for missing mobile number
    expect(await screen.findByText(/Mobile Number is required/i)).toBeInTheDocument();
    // Ensure registerUser was not called
    expect(registerUser).not.toHaveBeenCalled();
  });

  // Test handling of login failure
  test('handles login failure and shows error message', async () => {
    // Mock loginUser to reject with an error
    loginUser.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });

    render(<AuthCard role="user" />);
    // Simulate entering email and password
    fireEvent.change(screen.getByLabelText('Email Id'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });
    // Simulate clicking the Login button
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Wait for the loginUser call and verify parameters
    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith('user', {
        email: 'test@example.com',
        password: 'wrongpassword',
      });
    });

    // Verify error message in the snackbar
    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
  });

  // Test handling of signup failure
  test('handles signup failure and shows error message', async () => {
    // Mock registerUser to reject with an error
    registerUser.mockRejectedValue({
      response: { data: { message: 'Email already exists' } },
    });

    render(<AuthCard role="user" />);
    // Switch to signup view
    fireEvent.click(screen.getByText(/SIGNUP/i));
    // Simulate entering all fields
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email Id'), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'mypassword' } });
    fireEvent.change(screen.getByLabelText('Mobile Number'), { target: { value: '1234567890' } });
    // Simulate clicking the Signup button
    fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

    // Wait for the registerUser call and verify parameters
    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith('user', {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        password: 'mypassword',
      });
    });

    // Verify error message in the snackbar
    expect(await screen.findByText(/Email already exists/i)).toBeInTheDocument();
  });

  // Test toggling password visibility
  test('toggles password visibility', () => {
    render(<AuthCard role="user" />);
    // Get the password input field
    const passwordInput = screen.getByLabelText('Password');

    // Check initial state (password hidden)
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Simulate clicking the visibility toggle button
    fireEvent.click(screen.getByRole('button', { name: /toggle password visibility/i }));

    // Check if password is visible
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Simulate clicking again to hide password
    fireEvent.click(screen.getByRole('button', { name: /toggle password visibility/i }));

    // Check if password is hidden again
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // Test form submission on Enter key press
  test('submits on Enter key press in password field', async () => {
    // Mock loginUser to resolve with a successful response
    loginUser.mockResolvedValue({
      data: { code: 200, message: 'Login successful', data: { token: 'abc123' } },
    });

    render(<AuthCard role="user" />);
    // Simulate entering email and password
    fireEvent.change(screen.getByLabelText('Email Id'), { target: { value: 'test@example.com' } });
    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    // Simulate pressing Enter in the password field
    fireEvent.keyDown(passwordInput, { key: 'Enter' });

    // Wait for the loginUser call and verify parameters
    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith('user', {
        email: 'test@example.com',
        password: 'password123',
      });
    });

    // Verify success message in the snackbar
    expect(await screen.findByText(/Login successful/i)).toBeInTheDocument();
  });

  // Test storing token in localStorage on successful login
  test('stores token in localStorage on successful login', async () => {
    const mockToken = 'abc123';
    // Mock loginUser to resolve with a successful response
    loginUser.mockResolvedValue({
      data: { code: 200, message: 'Login successful', data: { token: mockToken } },
    });

    // Mock localStorage.setItem to track its calls
    const localStorageMock = jest.spyOn(Storage.prototype, 'setItem');

    render(<AuthCard role="user" />);
    // Simulate entering email and password
    fireEvent.change(screen.getByLabelText('Email Id'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    // Simulate clicking the Login button
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Wait for and verify localStorage call
    await waitFor(() => {
      expect(localStorageMock).toHaveBeenCalledWith('token', mockToken);
    });

    // Clean up the mock
    localStorageMock.mockRestore();
  });

  // Test that social login buttons are rendered in login view
  test('renders social login buttons in login view', () => {
    render(<AuthCard role="user" />);
    // Check if Facebook and Google buttons are present
    expect(screen.getByText(/Facebook/i)).toBeInTheDocument();
    expect(screen.getByText(/Google/i)).toBeInTheDocument();
  });

  // Test that social login buttons are not rendered in signup view
  test('does not render social login buttons in signup view', () => {
    render(<AuthCard role="user" />);
    // Switch to signup view
    fireEvent.click(screen.getByText(/SIGNUP/i));
    // Check that Facebook and Google buttons are not present
    expect(screen.queryByText(/Facebook/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Google/i)).not.toBeInTheDocument();
  });

  // Test signup with only a first name (no last name)
  test('handles full name with only first name during signup', async () => {
    // Mock registerUser to resolve with a successful response
    registerUser.mockResolvedValue({
      data: { code: 200, message: 'Signup successful' },
    });

    render(<AuthCard role="user" />);
    // Switch to signup view
    fireEvent.click(screen.getByText(/SIGNUP/i));
    // Simulate entering form fields with only a first name
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Email Id'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'mypassword' } });
    fireEvent.change(screen.getByLabelText('Mobile Number'), { target: { value: '1234567890' } });
    // Simulate clicking the Signup button
    fireEvent.click(screen.getByRole('button', { name: /Signup/i }));

    // Wait for the registerUser call and verify parameters
    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith('user', {
        firstName: 'John',
        lastName: '',
        email: 'john@example.com',
        password: 'mypassword',
      });
    });

    // Verify success message in the snackbar
    expect(await screen.findByText(/Signup successful/i)).toBeInTheDocument();
  });
});