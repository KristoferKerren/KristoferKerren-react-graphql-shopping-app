import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import Router from 'next/router';
import PaginationStyles from './styles/PaginationStyles';
import DisplayError from './ErrorMessage';
import { perPage } from '../config';
import { PAGINATION_QUERY } from '../lib/queries';

export default function Pagination({ page }) {
  const { error, loading, data } = useQuery(PAGINATION_QUERY);

  if (loading) return null;
  if (error) return <DisplayError error={error} />;

  const { count } = data._allProductsMeta;
  const pageCount = Math.ceil(count / perPage);

  if (typeof window !== 'undefined') {
    if (page < 1 || Number.isNaN(page)) {
      Router.replace({ pathname: `/products/1` });
    } else if (page > pageCount) {
      Router.replace({ pathname: `/products/${pageCount}` });
    }
  }

  return (
    <PaginationStyles data-testid="pagination">
      <Head>
        <title>
          Sick Fits - Page {page} of {pageCount}
        </title>
      </Head>
      <Link href={`/products/${page - 1}`}>
        <a aria-disabled={page <= 1}>⬅️ Prev</a>
      </Link>
      <p>
        Page {page} of {pageCount}
      </p>
      <p>{count} Items Total</p>
      <Link href={`/products/${page + 1}`}>
        <a aria-disabled={page >= pageCount}>Next ➡️</a>
      </Link>
    </PaginationStyles>
  );
}
