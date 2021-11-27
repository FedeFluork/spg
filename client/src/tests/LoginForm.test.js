import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../components/MyLogin';


describe('Test login form', () => {
  test('Test login form appearance', async () => {
    render(<LoginForm doLogin={() => jest.fn()} />);

    const usernameField = screen.getByPlaceholderText('Enter username');
    const passwordField = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByText('Login');
    const homeButton = screen.getByText('Back');

    expect(usernameField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(homeButton).toBeInTheDocument();
  });

});