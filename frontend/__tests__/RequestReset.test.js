import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import RequestReset from '../components/RequestReset';
import { REQUEST_RESET_MUTATION } from '../lib/queries';

const email = 'kristofer.kerren@gmail.com';
const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: { email },
    },
    result: { data: { sendUserPasswordResetLink: null } },
  },
];

describe('<RequestReset />', () => {
  it('Renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('Calls the mutation when submitted', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );
    userEvent.type(screen.getByPlaceholderText(/email/i), email);
    userEvent.click(screen.getByText(/request reset/i));
    const success = await screen.findByText(/success!/i);
    expect(success).toBeInTheDocument();
  });
});
