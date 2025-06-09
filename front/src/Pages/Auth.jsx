import React, {useState} from 'react';
import Auth from '../Features/Auth.jsx';


function AuthPage() {
        const [showAuth, setShowAuth] = useState(true);

    return (
        <div>
            {showAuth && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <Auth onClose={() => setShowAuth(false)} />
                </div>
            )}
        </div>
    );
}

export default AuthPage