import { useMutation, useQuery } from '@apollo/client';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import useForm from '../lib/useForm';
import { SINGLE_ITEM_QUERY, UPDATE_PRODUCT_MUTATION } from '../lib/queries';

export default function UpdateProduct({ id }) {
  const queryResponse = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id },
  });

  const [updateProduct, mutationResponse] = useMutation(
    UPDATE_PRODUCT_MUTATION
  );

  const { inputs, handleChange, clearForm, resetForm } = useForm(
    queryResponse.data?.Product
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProduct({
      variables: {
        id,
        name: inputs.name,
        description: inputs.description,
        price: inputs.price,
      },
    }).catch(console.error);
  };

  if (queryResponse.loading) return <p>Loading...</p>;
  if (queryResponse.error) return <DisplayError error={queryResponse.error} />;

  return (
    <Form onSubmit={handleSubmit}>
      <DisplayError error={queryResponse.error || mutationResponse.error} />
      <fieldset
        disabled={mutationResponse.loading}
        aria-busy={mutationResponse.loading}
      >
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">💾 Update product</button>
      </fieldset>
    </Form>
  );
}
