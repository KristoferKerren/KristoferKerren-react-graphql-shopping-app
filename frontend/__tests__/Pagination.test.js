import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { makePaginationMocksFor } from '../lib/testUtils';
import Pagination from '../components/Pagination';
import { perPage } from '../config';

describe('<Pagination />', () => {
  const nbrOfProducts = 18;
  const firstPageNbr = 1;
  const lastPageNumber = Math.ceil(nbrOfProducts / perPage);
  const middlePageNumber = Math.floor((firstPageNbr + lastPageNumber) / 2);

  it('Displays a loading message', () => {
    const { container } = render(
      <MockedProvider mocks={makePaginationMocksFor(1)}>
        <Pagination />
      </MockedProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('Renders pagination for all items', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(nbrOfProducts)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await screen.findByTestId('pagination');
    expect(container).toHaveTextContent(
      `Page ${firstPageNbr} of ${lastPageNumber}`
    );
    expect(container).toMatchSnapshot();
  });

  it('Disables the prev page on first page', async () => {
    const page = firstPageNbr;
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(nbrOfProducts)}>
        <Pagination page={page} />
      </MockedProvider>
    );
    await screen.findByTestId('pagination');
    const prevButton = screen.getByText(/Prev/);
    const nextButton = screen.getByText(/Next/);
    expect(prevButton).toHaveAttribute('aria-disabled', true.toString());
    expect(nextButton).toHaveAttribute('aria-disabled', false.toString());
    expect(nextButton).toHaveAttribute('href', `/products/${page + 1}`);
  });

  it('Disables the next page on last page', async () => {
    const page = lastPageNumber;
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(nbrOfProducts)}>
        <Pagination page={page} />
      </MockedProvider>
    );
    await screen.findByTestId('pagination');
    const prevButton = screen.getByText(/Prev/);
    const nextButton = screen.getByText(/Next/);
    expect(prevButton).toHaveAttribute('aria-disabled', false.toString());
    expect(nextButton).toHaveAttribute('aria-disabled', true.toString());
    expect(prevButton).toHaveAttribute('href', `/products/${page - 1}`);
  });

  it('Enables both pages on middle page', async () => {
    const page = middlePageNumber;
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(nbrOfProducts)}>
        <Pagination page={page} />
      </MockedProvider>
    );
    await screen.findByTestId('pagination');
    const prevButton = screen.getByText(/Prev/);
    const nextButton = screen.getByText(/Next/);
    expect(prevButton).toHaveAttribute('aria-disabled', false.toString());
    expect(nextButton).toHaveAttribute('aria-disabled', false.toString());
    expect(prevButton).toHaveAttribute('href', `/products/${page - 1}`);
    expect(nextButton).toHaveAttribute('href', `/products/${page + 1}`);
  });
});
