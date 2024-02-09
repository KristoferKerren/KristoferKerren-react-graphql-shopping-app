import { useQuery } from '@apollo/client';
import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';
import DisplayError from './ErrorMessage';
import formatMoney from '../lib/formatMoney';
import getImageUrl from '../lib/getImageUrl';
import { SINGLE_ITEM_QUERY } from '../lib/queries';

const ProductStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  max-width: var(--maxWidth);
  justify-content: center;
  align-items: top;
  gap: 2rem;

  img {
    width: 100%;
    object-fit: contain;
  }
`;

export default function SingleProduct({ id }) {
  const { data, loading, error } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id },
  });

  if (loading) return <p>Loading....</p>;
  if (error) return <DisplayError error={error} />;
  const { Product: product } = data;
  return (
    <ProductStyles data-testid="singleProduct">
      <Head>
        <title>Sick Fits | {product.name}</title>
      </Head>
      <img src={getImageUrl(product)} alt={product.photo.altText} />
      <div className="details">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>Cost: {formatMoney(product.price)}</p>
        <Link
          href={{
            pathname: '/update',
            query: {
              id: product.id,
            },
          }}
        >
          ✏️ Edit
        </Link>
      </div>
    </ProductStyles>
  );
}
