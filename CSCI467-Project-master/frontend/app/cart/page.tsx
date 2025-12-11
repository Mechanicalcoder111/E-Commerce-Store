import Header from '../components/Header';
import Footer from '../components/Footer';

const CartPage = () => {
  return (
    <>
      <Header />
      <main style={{ padding: '2rem' }}>
        <h1>Your Cart</h1>
        <p>This is the cart page where items will be displayed.</p>
      </main>
      <Footer />
    </>
  );
};

export default CartPage;