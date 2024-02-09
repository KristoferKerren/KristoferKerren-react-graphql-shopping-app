import { useMutation } from '@apollo/client';
import { ADD_TO_CART_MUTATION, CURRENT_USER_QUERY } from '../lib/queries';

export default function AddToCart({ productId }) {
  const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: { productId },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  return (
    <button disabled={loading} type="button" onClick={addToCart}>
      🛒 Add{loading && 'ing'} to Cart
    </button>
  );
}
