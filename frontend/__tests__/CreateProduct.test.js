import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import Router from 'next/router';
import wait from 'waait';
import CreateProduct from '../components/CreateProduct';
import { CREATE_PRODUCT_MUTATION, ALL_PRODUCTS_QUERY } from '../lib/queries';
import { fakeItem } from '../lib/testUtils';
import { perPage } from '../config';

const item = fakeItem();

const mocks = [
  {
    request: {
      query: CREATE_PRODUCT_MUTATION,
      variables: {
        name: item.name,
        description: item.description,
        image: '',
        price: item.price,
      },
    },
    result: {
      data: { createProduct: { ...item, __typename: 'Item' } },
    },
  },
  {
    request: {
      query: ALL_PRODUCTS_QUERY,
      variables: {
        first: perPage,
      },
    },
    result: {
      data: { allProducts: [item] },
    },
  },
];

jest.mock('next/router', () => ({
  push: jest.fn(),
}));

describe('<CreateProduct />', () => {
  it('Renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('Handles the updating', async () => {
    const { container, debug } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );
    await userEvent.type(screen.getByPlaceholderText(/name/i), item.name);
    await userEvent.clear(screen.getByPlaceholderText(/price/i));
    await userEvent.type(
      screen.getByPlaceholderText(/price/i),
      item.price.toString()
    );
    await userEvent.type(
      screen.getByPlaceholderText(/description/i),
      item.description
    );
    expect(screen.getByDisplayValue(item.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.price)).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.description)).toBeInTheDocument();
  });

  it('Creates the items when the form is submitted', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <CreateProduct />
      </MockedProvider>
    );
    await userEvent.type(screen.getByPlaceholderText(/name/i), item.name);
    await userEvent.clear(screen.getByPlaceholderText(/price/i));
    await userEvent.type(
      screen.getByPlaceholderText(/price/i),
      item.price.toString()
    );
    await userEvent.type(
      screen.getByPlaceholderText(/description/i),
      item.description
    );

    await userEvent.click(screen.getByText(/add product/i));
    await waitFor(() => wait(0));
    expect(Router.push).toHaveBeenCalled();
    expect(Router.push).toHaveBeenCalledWith({
      pathname: `/product/${item.id}`,
    });
  });
});
