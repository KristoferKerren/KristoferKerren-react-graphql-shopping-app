import { useMutation } from '@apollo/client';
import styled from 'styled-components';
import { REMOVE_FROM_CART_ITEM_MUTATION } from '../lib/queries';

const RemoveFromCartButtonStyles = styled.button`
  border: none;
  background-color: transparent;
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

export default function RemoveFromCart({ id }) {
  const [deleteCartItem, { loading }] = useMutation(
    REMOVE_FROM_CART_ITEM_MUTATION,
    {
      variables: { id },
      update,
      //   optimisticResponse: {
      //     deleteCartItem: {
      //       __typename: 'CartItem',
      //       id,
      //     },
      //   },
    }
  );
  return (
    <RemoveFromCartButtonStyles
      type="button"
      title="Remove product from cart"
      disabled={loading}
      onClick={deleteCartItem}
    >
      🗑️
    </RemoveFromCartButtonStyles>
  );
}
