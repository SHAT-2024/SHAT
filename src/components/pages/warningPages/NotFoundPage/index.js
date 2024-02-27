
import { useContext } from 'react';
import './NFP.scss';
import { appContext } from '../../../../context';

function NotFoundPage() {

  const contextt = useContext(appContext);
  let navigate = contextt.navigate;

  return (
    <div className='warnings'>
      <p>Page not found, <u onClick={()=>{navigate('/')}} style={{cursor:'pointer'}}>press here to go back to the home page</u></p>
    </div>
  )
}

export default NotFoundPage;