import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { fakeUser, fakeCartItem } from '../lib/testUtils';
import { CartStateProvider } from '../lib/cartState';
import { CURRENT_USER_QUERY } from '../lib/queries';
import Nav from '../components/Nav';

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: null } },
  },
];

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: fakeUser() } },
  },
];

const signedInMocksWithCartItems = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: { authenticatedItem: fakeUser({ cart: [fakeCartItem()] }) },
    },
  },
];

describe('<Nav />', () => {
  it('Renders mininmal nav when signed out', () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={notSignedInMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );
    expect(container).toHaveTextContent(/sign in/i);
    expect(container).toHaveTextContent(/products/i);
    expect(container).not.toHaveTextContent(/sign out/i);
    expect(container).toMatchSnapshot();

    const link = screen.getByText(/sign in$/i);
    expect(link).toHaveAttribute('href', '/signin');

    const productLink = screen.getByText(/products$/i);
    expect(productLink).toHaveAttribute('href', '/products');
  });

  it('Renders a full nav when signed in', async () => {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={signedInMocks}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );
    await screen.findByText('Account');
    expect(container).not.toHaveTextContent(/sign in/i);
    expect(container).toHaveTextContent(/products/i);
    expect(container).toHaveTextContent(/sign out/i);
    expect(container).toMatchSnapshot();

    // const link = screen.getByText(/sign out$/i);
    // expect(link).toHaveAttribute('href', '/signin');

    const productLink = screen.getByText(/products$/i);
    expect(productLink).toHaveAttribute('href', '/products');
  });

  it('Renders the amount of items in the cart', async function () {
    const { container, debug } = render(
      <CartStateProvider>
        <MockedProvider mocks={signedInMocksWithCartItems}>
          <Nav />
        </MockedProvider>
      </CartStateProvider>
    );
    await screen.findByText('Account');
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
