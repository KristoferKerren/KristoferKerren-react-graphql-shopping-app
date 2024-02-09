import styled from 'styled-components';
import { useUser } from './User';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import formatMoney from '../lib/formatMoney';
import calcTotalPrice from '../lib/calcTotalPrice';
import { useCart } from '../lib/cartState';
import CartItem from './CartItem';
import { Checkout } from './Checkout';

const CartBackdropStyles = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 3;
  background-color: rgba(100, 100, 100, 0.5);

  &.is-open {
    display: block;
  }
`;

const CloseButtonStyles = styled.button`
  position: absolute;
  top: 0px;
  right: 10px;
  font-size: 45px;
  border: none;
  background-color: transparent;
`;

export default function Cart() {
  const user = useUser();
  const { cartOpen, closeCart } = useCart();

  if (!user) return null;
  return (
    <CartBackdropStyles
      className={`${cartOpen ? 'is-open' : ''}`}
      onClick={closeCart}
    >
      <CartStyles open={cartOpen} onClick={(event) => event.stopPropagation()}>
        <header>
          <Supreme>{user.name}'s Cart</Supreme>
          <CloseButtonStyles type="button" onClick={closeCart}>
            &times;
          </CloseButtonStyles>
        </header>
        <ul>
          {user.cart.map((cartItem) => (
            <CartItem key={cartItem.id} cartItem={cartItem} />
          ))}
        </ul>
        <footer>
          <Checkout totalAmount={calcTotalPrice(user.cart)} />
        </footer>
      </CartStyles>
    </CartBackdropStyles>
  );
}
