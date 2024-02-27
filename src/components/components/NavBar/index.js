import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './NavBar.scss';
import { Link } from 'react-router-dom';
import NavBarMenu from './NavBarMenu';
import shatLogo from '../../../Assets/shat-logo-2.png';

function TextLinkExample() {
  return (
   <Navbar className="navbar-background fixed-top bg-body-tertiary" style={{zIndex:'3', backgroundImage: 'linear-gradient(45deg, #3e3e3e, #333333)', '!important': 'true'}}>
      <Container>
        <Navbar.Brand>
            <Link to={'/'}><img src={shatLogo} alt='logo' className='shat-logo' /></Link>
            </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <NavBarMenu />
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TextLinkExample;