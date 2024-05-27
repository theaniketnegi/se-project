import { Route, Routes } from 'react-router-dom';
import SignInPage from './components/SignIn/SignInPage';
import Home from './components/Home';
import { useEffect } from 'react';
import { useUserStore } from './store/userStore';
import AdminSignIn from './components/SignIn/AdminSigninPage';
import Admin from './components/Admin/Admin';
import { useAdminStore } from './store/adminStore';

const App = () => {
    const setUser = useUserStore((state) => state.setUser);
    const setAdmin = useAdminStore((state) => state.setAdmin);
    useEffect(() => {
        if (localStorage.getItem('userPayload')) {
            setUser(JSON.parse(localStorage.getItem('userPayload') as string));
        } else if (localStorage.getItem('adminPayload')) {
            setAdmin(
                JSON.parse(localStorage.getItem('adminPayload') as string),
            );
        }
    }, [setUser, setAdmin]);
    return (
        <div className='h-full'>
            <Routes>
                <Route path='/' element={<SignInPage />} />
                <Route path='/admin' element={<AdminSignIn />} />
                <Route path='/admin/*' element={<Admin />} />
                <Route path='/*' element={<Home />} />
            </Routes>
        </div>
    );
};
export default App;
