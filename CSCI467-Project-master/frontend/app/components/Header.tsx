import Link from 'next/link';

const Header = () => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <nav>
        <Link href="/" style={{ margin: '0 1rem' }}>
          Home
        </Link>
        <Link href="/cart" style={{ margin: '0 1rem' }}>
          Cart
        </Link>
        <Link href="/checkout" style={{ margin: '0 1rem' }}>
          Checkout
        </Link>
        <Link href="/login" style={{ margin: '0 1rem' }}>
          Staff Login
        </Link>
      </nav>
    </header>
  );
};

export default Header;

