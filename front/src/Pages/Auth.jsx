import React, {useState} from 'react';
import Login from '../Features/Login/Login.jsx';
import Register from '../Features/Register/Register.jsx';


function Auth() {
    const [isRegistering, setIsRegistering] = useState(false);


    return (
        <div>
            {isRegistering ? (
                <Register goToLogin={() => setIsRegistering(false)}/>
            ) : (
                <Login goToRegister={() => setIsRegistering(true)}/>
            )}
        </div>
    );
}

export default Auth