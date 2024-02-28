import { Route, Routes } from 'react-router-dom';
import SignInPage from './components/SignIn/SignInPage';
import Home from './components/Home';
import { useUserStore } from './store/userStore';

const App = () => {
    const setUser = useUserStore((state) => state.setUser);
    if (localStorage.getItem('userPayload')) {
        setUser(JSON.parse(localStorage.getItem('userPayload') as string));
    }
    return (
        <div className='h-full'>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<SignInPage />} />
            </Routes>
        </div>
    );
};
export default App;
