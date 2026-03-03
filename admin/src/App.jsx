import { Navigate, Route, Routes } from 'react-router';
import LoginPage from './pages/LoginPage';
import {useAuth} from '@clerk/clerk-react';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import DashboardLayout from './layouts/DashboardLayout';
import PageLoader from './components/PageLoader';

function App() {
  
  //authentication
  const { isSignedIn , isLoaded } = useAuth();

  //if clerk is not loaded show loading spinner
  if(!isLoaded) return <PageLoader />

  return ( 

    //routes/pages
    <Routes>

{/* if signed in, show dashboard layout; otherwise, show login page */}
      <Route path="/login" element={isSignedIn ? <Navigate to="/dashboard" /> : <LoginPage />} />

{/* if signed in, show dashboard layout; otherwise, show login page */}
      <Route path="/" element={isSignedIn ? <DashboardLayout /> : <Navigate to="/login" />} >
      <Route index element = {<Navigate to={"dashboard"} />} />
      <Route path = "dashboard" element={<DashboardPage />} />
      <Route path = "products" element={<ProductsPage />} />
      <Route path = "orders" element={<OrdersPage />} />
      <Route path = "customers" element={<CustomersPage />} />

      </Route>
    </Routes>
  );
}

export default App;