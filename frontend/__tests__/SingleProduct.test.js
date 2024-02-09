import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import SingleProduct from '../components/SingleProduct';
import { fakeItem } from '../lib/testUtils';
import { SINGLE_ITEM_QUERY } from '../lib/queries';

const product = fakeItem();
const mocks = [
  {
    request: {
      query: SINGLE_ITEM_QUERY,
      variables: {
        id: '123',
      },
    },
    result: {
      data: {
        Product: product,
      },
    },
  },
  {
    request: {
      query: SINGLE_ITEM_QUERY,
      variables: {
        id: 'error123',
      },
    },
    result: {
      errors: [{ message: 'Item not found' }],
    },
  },
];

describe('<SingleProduct/>', () => {
  it('renders with proper data', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <SingleProduct id="123" />
      </MockedProvider>
    );
    // Wait for loading to be done
    await screen.findByTestId('singleProduct');
    expect(container).toMatchSnapshot();
  });

  it('Errors out when an item is not found', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <SingleProduct id="error123" />
      </MockedProvider>
    );
    await screen.findAllByTestId('graphql-error');
    expect(container).toHaveTextContent('Item not found');
  });
});
