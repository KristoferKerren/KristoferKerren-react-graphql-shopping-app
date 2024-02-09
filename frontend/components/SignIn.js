import { useMutation } from '@apollo/client';
import Router from 'next/router';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import Error from './ErrorMessage';
import {
  CURRENT_USER_QUERY,
  SIGNIN_MUTATION,
  USER_ORDERS_QUERY,
} from '../lib/queries';

export default function SignIn({ redirectToHome }) {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
  });

  const [signIn, { data, loading }] = useMutation(SIGNIN_MUTATION, {
    variables: inputs,
    refetchQueries: [
      { query: CURRENT_USER_QUERY },
      { query: USER_ORDERS_QUERY },
    ],
  });

  const getSignInError = (responseData) =>
    responseData?.authenticateUserWithPassword?.__typename ===
    'UserAuthenticationWithPasswordFailure'
      ? responseData?.authenticateUserWithPassword
      : undefined;

  const error = getSignInError(data);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn();
    if (!getSignInError(res?.data) && redirectToHome) {
      Router.push({ pathname: `/` });
    }
  };

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Sign Into Your Account</h2>
      <Error error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sign In</button>
      </fieldset>
    </Form>
  );
}
