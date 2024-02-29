import { Route, Routes } from 'react-router-dom';
import SignInPage from './components/SignIn/SignInPage';
import Home from './components/Home';
import { useEffect } from 'react';
import { useUserStore } from './store/userStore';

const App = () => {
    const setUser = useUserStore((state) => state.setUser);
    useEffect(() => {
        if (localStorage.getItem('userPayload')) {
            setUser(JSON.parse(localStorage.getItem('userPayload') as string));
        }
    }, [setUser]);
    return (
        <div className='h-full'>
            <Routes>
                <Route path='/' element={<SignInPage />} />
                <Route path='/*' element={<Home />} />
            </Routes>
        </div>
    );
};
export default App;
