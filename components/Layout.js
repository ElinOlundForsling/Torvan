import {
  Button,
  Nav,
  Navbar,
  NavDropdown,
  Form,
  FormControl,
  Container,
} from 'react-bootstrap';
import { AuthCheck, useUser, useAuth } from 'reactfire';

export default function Layout({ children }) {
  const { data: user } = useUser();
  const auth = useAuth();

  const signoutHandler = e => {
    e.preventDefault();
    auth.signOut();
  };

  return (
    <main>
      <Navbar bg='success' variant='dark' expand='lg'>
        <Navbar.Brand href='/'>Torvan</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto'>
            <Nav.Link href='/'>Hem</Nav.Link>
            <Nav.Link href='/shop'>Shop</Nav.Link>
            <Nav.Link href='http://torvans.blogspot.com/'>Blog</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href='/cart'>
              <span className='material-icons md-nav'>shopping_cart</span>
              Kundvagn
            </Nav.Link>
            <AuthCheck
              fallback={
                <>
                  <Nav.Link href='/signin'>Logga in</Nav.Link>
                  <Nav.Link href='/signup'>Registera</Nav.Link>
                </>
              }>
              <NavDropdown
                title={(user && user.displayName) || 'Konto'}
                id='basic-nav-dropdown'
                className='mr-0'>
                <NavDropdown.Item href='/profile'>Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={signoutHandler}>
                  Sign out
                </NavDropdown.Item>
              </NavDropdown>
            </AuthCheck>

            <NavDropdown title='Admin' id='basic-nav-dropdown' className='mr-3'>
              <NavDropdown.Item href='/admin/users'>Users</NavDropdown.Item>
              <NavDropdown.Item href='/admin/products'>
                Products
              </NavDropdown.Item>
              <NavDropdown.Item href='/admin/orders'>Orders</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form inline>
            <FormControl type='text' placeholder='Search' className='mr-sm-2' />
            <Button variant='success'>
              <span className='material-icons lh-in'>search</span>
            </Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <Container className='mt-5'>{children}</Container>
    </main>
  );
}
