import { useMutation } from '@apollo/client';
import { DELETE_PRODUCT_MUTATION } from '../lib/queries';

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteProduct)); // Delete from cache
}

export default function DeleteProduct({ id, children }) {
  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT_MUTATION, {
    variables: { id },
    update,
  });

  const handleClick = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteProduct().catch(console.error);
    }
  };

  return (
    <button type="button" disabled={loading} onClick={handleClick}>
      {children}
    </button>
  );
}
