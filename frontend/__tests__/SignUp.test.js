import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import SignUp from '../components/SignUp';
import { SIGNUP_MUTATION, CURRENT_USER_QUERY } from '../lib/queries';
import { fakeUser } from '../lib/testUtils';

const user = fakeUser();
const password = 'kris1234';

const mocks = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        email: user.email,
        name: user.name,
        password,
      },
    },
    result: {
      data: {
        createUser: {
          __typename: 'User',
          id: 'abc123',
          name: user.name,
          email: user.email,
        },
      },
    },
  },
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: user } },
  },
];

describe('<SignUp />', () => {
  it('Renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <SignUp> </SignUp>
      </MockedProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it('Calls the mutation properly', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <SignUp />
      </MockedProvider>
    );
    await userEvent.type(screen.getByPlaceholderText(/name/i), user.name);
    await userEvent.type(screen.getByPlaceholderText(/email/i), user.email);
    await userEvent.type(screen.getByPlaceholderText(/password/i), password);
    await userEvent.click(screen.getByTestId('signUpButton'));
    await screen.findByText(new RegExp(`Signed up with ${user.email}`, 'i'));
  });
});
