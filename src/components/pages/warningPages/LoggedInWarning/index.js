import React, { useContext } from 'react';
import { appContext } from '../../../../context';

function LoggedInWarning() {

  const contextt = useContext(appContext);
  let navigate = contextt.navigate;

  return (
    <div className='warnings'>
      <p>you should be logged in! <u onClick={()=>{navigate('/')}} style={{cursor:'pointer'}}>press here to go back to the home page</u></p>
    </div>
  )
}

export default LoggedInWarning;