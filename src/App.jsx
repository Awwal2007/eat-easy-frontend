import React from 'react';
import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import NotFound from './pages/Notfound';
import Header from './components/Header';
import Home from './pages/Home';
import SignUp from './pages/signUp';
import { Toaster } from 'sonner';
import SellerSignup from './pages/SellerSignup';
import SellerLogin from './pages/SellerLogin';
import Login from './pages/Login';
import VerifyAccount from './pages/VerifyAccount';
import AuthProvider from './contexts/AuthProvider';
import SellerDashboard from './pages/SellerDashboard';
import AddProductForm from './components/AddProductForm';
import ProductProvider from './contexts/ProductProvider';
import AllProduct from './pages/AllProduct';
import SingleProduct from './pages/SingleProduct';
import { CartProvider } from './contexts/CartProvider';
import ProtedtedRoutes from './components/ProtectedRoute';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

// Wrapper component to use hooks like useLocation
const AppContent = () => {
  const location = useLocation();

  // List of routes where Header should NOT be shown
  const hideHeaderRoutes = [
    '/signup', 
    '/signin', 
    '/seller-dashboard', 
    '/seller-signin', 
    '/seller-signup'
  ];

  return (
    <>

      <AuthProvider>
        <ProductProvider>
          <CartProvider>
          {!hideHeaderRoutes.includes(location.pathname) && <Header />}
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/signup' element={<SignUp />} />
                <Route path='/signin' element={<Login />} />
                <Route path='*' element={<NotFound />} />
                <Route path='/seller-signup' element={<SellerSignup />} />
                <Route path='/seller-signin' element={<SellerLogin />} />
                <Route path='/seller-dashboard' element={<SellerDashboard />} />
                <Route path='/add-product' element={<AddProductForm />} />
                <Route path='/all-product' element={<AllProduct />} />
                <Route path='/checkout' element={<CheckoutPage />} />
                <Route path='/product/:id' element={<SingleProduct />} />
                <Route path="/verify/:token" element={<VerifyAccount />}/>

                <Route element={<ProtedtedRoutes />}>
                  <Route path='/cart' element={<CartPage />} />
                </Route>
              </Routes>

              <Toaster
                position="top-center"
                richColors
                closeButton
                visibleToasts={1}
              />
          </CartProvider>          
        </ProductProvider>
      </AuthProvider>
    </>
  );
};

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
};

export default App;
