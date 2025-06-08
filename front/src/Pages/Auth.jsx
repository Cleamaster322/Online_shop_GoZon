import React, {useState} from 'react';
import Login from '../Features/Login/Login.jsx';
import Register from '../Features/Register/Register.jsx';


function Auth() {
    const [isRegistering, setIsRegistering] = useState(false);


    return (
        <div>
            <h1 className="text-5xl font-bold text-center py-{60px}"> Авторизация  </h1>
            {isRegistering ? (
                <Register goToLogin={() => setIsRegistering(false)}/>
            ) : (
                <Login goToRegister={() => setIsRegistering(true)}/>
            )}
        </div>
    );
}

export default Auth