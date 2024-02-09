import formatMoney from '../lib/formatMoney';
import getImageUrl from '../lib/getImageUrl';

export default function OrderItem({ orderItem }) {
  return (
    <li className="order-item">
      <img src={getImageUrl(orderItem)} alt={orderItem.name} />
      <div>
        <h2>{orderItem.name}</h2>
        <p>Qty: {orderItem.quantity}</p>
        <p>Each: {formatMoney(orderItem.price)}</p>
        <p>Sub Total: {formatMoney(orderItem.quantity * orderItem.price)}</p>
        <p>{orderItem.description}</p>
      </div>
    </li>
  );
}
