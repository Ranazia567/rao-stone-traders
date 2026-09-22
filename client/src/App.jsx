import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import FreightEstimator from './pages/FreightEstimator';
import TrackOrder from './pages/TrackOrder';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

const App = () => (
  <Routes>
    <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
    <Route path="/shop" element={<PublicLayout><Shop /></PublicLayout>} />
    <Route path="/product/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
    <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
    <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
    <Route path="/freight" element={<PublicLayout><FreightEstimator /></PublicLayout>} />
    <Route path="/track" element={<PublicLayout><TrackOrder /></PublicLayout>} />
    <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
    <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
    <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
