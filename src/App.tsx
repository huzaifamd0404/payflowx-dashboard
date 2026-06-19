import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Payments from './pages/Payments';
import PaymentDetails from './pages/PaymentDetails';
import CreatePayment from './pages/CreatePayment';
import PaymentSearch from './pages/PaymentSearch';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="payments" element={<Payments />} />
            <Route path="payments/:id" element={<PaymentDetails />} />
            <Route path="create-payment" element={<CreatePayment />} />
            <Route path="payment-search" element={<PaymentSearch />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
        toastClassName="text-sm"
      />
    </>
  );
}

export default App;
