import {
  Button,
  Nav,
  Navbar,
  NavDropdown,
  Form,
  FormControl,
  Container,
} from 'react-bootstrap';
import {
  AuthCheck,
  useUser,
  useAuth,
  useFirestore,
  useFirestoreCollectionData,
} from 'reactfire';

export default function Layout({ children }) {
  const auth = useAuth();
  const { data: user } = useUser();
  const userId = user && user.uid ? user.uid : 'null';
  const query = useFirestore()
    .collection('users')
    .doc(userId)
    .collection('cart');
  const cart = useFirestoreCollectionData(query, {
    idField: 'id',
    initialData: [],
  }).data;

  const signoutHandler = e => {
    e.preventDefault();
    auth.signOut();
  };

  // const functions = useFunctions();
  // const makeAdmin = functions.httpsCallable('addAdminRole');

  // useEffect(async () => {
  //   if (user) {
  //     await makeAdmin({ email: user.email });
  //     user.getIdTokenResult().then(res => {
  //       console.log(res.claims);
  //     });
  //   }
  // }, [user]);

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
              Kundvagn {cart.length > 0 && cart.length}
            </Nav.Link>
            {user && user.email ? (
              <NavDropdown
                title={(user && user.displayName) || 'Konto'}
                id='basic-nav-dropdown'
                className='mr-0'>
                <NavDropdown.Item href='/profile'>Profil</NavDropdown.Item>
                <NavDropdown.Item onClick={signoutHandler}>
                  Logga ut
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link href='/signin'>Logga in</Nav.Link>
                <Nav.Link href='/signup'>Registera</Nav.Link>
              </>
            )}
            {user && (
              <AuthCheck
              // requiredClaims={{ isAdmin: true }}
              >
                <NavDropdown
                  title='Admin'
                  id='basic-nav-dropdown'
                  className='mr-3'>
                  <NavDropdown.Item href='/admin/users'>
                    Användare
                  </NavDropdown.Item>
                  <NavDropdown.Item href='/admin/products'>
                    Produkter
                  </NavDropdown.Item>
                  <NavDropdown.Item href='/admin/orders'>
                    Beställningar
                  </NavDropdown.Item>
                </NavDropdown>
              </AuthCheck>
            )}
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
