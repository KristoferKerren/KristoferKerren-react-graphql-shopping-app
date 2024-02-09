import Link from 'next/link';
import styled from 'styled-components';
import ItemStyles from './styles/ItemStyles';
import Title from './styles/Title';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import DeleteProduct from './DeleteProduct';
import AddToCart from './AddToCart';
import getImageUrl from '../lib/getImageUrl';

const LinkStyles = styled.button`
  display: flex;
  justify-content: center;
`;

export default function Product({ product }) {
  return (
    <ItemStyles>
      <img src={getImageUrl(product)} alt={product.name} />
      <Title>
        <Link href={`/product/${product.id}`}>{product.name}</Link>
      </Title>
      <PriceTag>{formatMoney(product.price)}</PriceTag>
      <p>{product.description}</p>
      <div className="buttonList">
        <LinkStyles>
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
        </LinkStyles>
        <AddToCart productId={product.id} />
        <DeleteProduct id={product.id}>🗑️ Delete</DeleteProduct>
      </div>
    </ItemStyles>
  );
}
