import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import Head from 'next/dist/next-server/lib/head';
import Link from 'next/link';
import DisplayError from '../components/ErrorMessage';
import OrderItemStyles from '../components/styles/OrderItemStyles';
import formatMoney from '../lib/formatMoney';
import getImageUrl from '../lib/getImageUrl';
import PleaseSignIn from '../components/PleaseSignIn';
import { USER_ORDERS_QUERY } from '../lib/queries';

const OrderList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

const totalQuantityInOrder = (order) =>
  order.items.reduce((tally, orderItem) => tally + orderItem.quantity, 0);

export default function OrderPage() {
  const { data, loading, error } = useQuery(USER_ORDERS_QUERY);

  if (loading) return <p>Loading....</p>;
  if (error)
    return (
      <PleaseSignIn>
        <DisplayError error={error} />
      </PleaseSignIn>
    );
  const { allOrders } = data;
  return (
    <div>
      <Head>
        <title>Sick fits - Your Orders ({allOrders.length})</title>
      </Head>
      <h2>You have {allOrders.length} orders!</h2>
      <OrderList>
        {allOrders.map((order) => (
          <OrderItemStyles key={order.id}>
            <Link href={`/order?id=${order.id}`}>
              <a>
                <div className="order-meta">
                  <p>
                    {totalQuantityInOrder(order)} item
                    {totalQuantityInOrder(order) !== 1 && 's'}
                  </p>
                  <p>
                    {order.items.length} product
                    {order.items.length !== 1 && 's'}
                  </p>
                  <p>{formatMoney(order.total)}</p>
                </div>
                <div className="images">
                  {order.items.map((item) => (
                    <img
                      key={item.id}
                      src={getImageUrl(item)}
                      alt={item.name}
                    />
                  ))}
                </div>
              </a>
            </Link>
          </OrderItemStyles>
        ))}
      </OrderList>
    </div>
  );
}
