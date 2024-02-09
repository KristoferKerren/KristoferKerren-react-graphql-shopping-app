import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import styled from 'styled-components';
import { useState } from 'react';
import nProgress from 'nprogress';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import SickButton from './styles/SickButton';
import { useCart } from '../lib/cartState';
import formatMoney from '../lib/formatMoney';
import {
  CREATE_ORDER_MUTATION,
  CURRENT_USER_QUERY,
  USER_ORDERS_QUERY,
} from '../lib/queries';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm({ totalAmount }) {
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { closeCart } = useCart();

  const [checkout, { error: graphQlError }] = useMutation(
    CREATE_ORDER_MUTATION,
    {
      refetchQueries: [
        { query: CURRENT_USER_QUERY },
        { query: USER_ORDERS_QUERY },
      ],
    }
  );

  const handleSubmit = async (e) => {
    // 1. Preventdefault and turn loader on:
    e.preventDefault();
    setLoading(true);
    nProgress.start();
    // 2. Create the payment method via stripe (token is returned if success)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    // 3. Handle any errors from stripe
    if (error) {
      setError(error);
      setLoading(false);
      nProgress.done();
      return;
    }
    // 4. Take the token from 2 and send to keystone server
    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    });

    router.push({
      pathname: '/order',
      query: { id: order.data.checkout.id },
    });
    // 6. Close cart and turn loader off
    closeCart();
    setLoading(false);
    nProgress.done();
  };

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <p style={{ fontSize: 12 }}>{error.message}</p>}
      {graphQlError && <p style={{ fontSize: 12 }}>{graphQlError.message}</p>}
      <CardElement />
      <SickButton disabled={loading || totalAmount === 0}>
        Check out now
      </SickButton>
    </CheckoutFormStyles>
  );
}

function Checkout({ totalAmount }) {
  return (
    <>
      <p>{formatMoney(totalAmount)}</p>
      <Elements stripe={stripeLib}>
        <CheckoutForm totalAmount={totalAmount} />
      </Elements>
    </>
  );
}

export { Checkout };
