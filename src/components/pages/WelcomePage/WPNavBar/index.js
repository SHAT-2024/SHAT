import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { appContext } from '../../../../context';
import shatLogo from '../../../../Assets/shat-logo.png';
import './WPnavbar.scss';

function WMNavBar() {

  const contextt = useContext(appContext);

  const setIsUserCreatedSucc = contextt.setIsUserCreatedSucc;
  const navigate = contextt.navigate;

  return (
   <Navbar className="navbar-background fixed-top bg-body-tertiary" style={{zIndex:'9', backgroundImage: 'linear-gradient(45deg, #3e3e3e, #333333)', '!important': 'true'}}>
      <Container>
        <Navbar.Brand>
            <Link to={'/'}><img src={shatLogo} alt='logo' style={{width:'8vmax'}}></img></Link>
            </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {/* <p className='white-color'>sign-in or sign-up</p> */}
            <div className="wp-registration">
              <button onClick={()=>{setIsUserCreatedSucc(false); navigate(`/registeration`);}}>Sign up</button>
              <button onClick={()=>{setIsUserCreatedSucc(true); navigate(`/registeration`);}}>Sign in</button>
            </div>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default WMNavBar;