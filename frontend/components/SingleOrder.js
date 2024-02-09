import { useQuery } from '@apollo/client';
import { Router } from 'next/router';
import Head from 'next/head';
import DisplayError from './ErrorMessage';
import formatMoney from '../lib/formatMoney';
import OrderItem from './OrderItem';
import OrderStyles from './styles/OrderStyles';
import { SINGLE_ORDER_QUERY } from '../lib/queries';

export default function SingleOrder({ id }) {
  if (!id) {
    Router.push({ pathname: `/orders` });
  }
  const { data, loading, error } = useQuery(SINGLE_ORDER_QUERY, {
    variables: { id },
  });

  if (loading) return <p>Loading....</p>;
  if (error) return <DisplayError error={error} />;
  const { Order: order } = data;

  return (
    <OrderStyles>
      <Head>
        <title> Sick fits - Order {order.id} </title>
      </Head>
      <p>
        <span>Order Id:</span>
        <span>{order.id}</span>
      </p>
      <p>
        <span>Order Charge:</span>
        <span>{order.charge}</span>
      </p>
      <p>
        <span>Order Total:</span>
        <span>{formatMoney(order.total)}</span>
      </p>
      <p>
        <span>Itam count:</span>
        <span>{order.items?.length || 0}</span>
      </p>
      <h3>Products:</h3>
      <ul>
        {order.items.map((item) => (
          <OrderItem key={item.id} orderItem={item} />
        ))}
      </ul>
    </OrderStyles>
  );
}
