import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Payments from './pages/Payments';
import PaymentDetails from './pages/PaymentDetails';
import CreatePayment from './pages/CreatePayment';
import PaymentSearch from './pages/PaymentSearch';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="payments" element={<Payments />} />
          <Route path="payments/:id" element={<PaymentDetails />} />
          <Route path="create-payment" element={<CreatePayment />} />
          <Route path="payment-search" element={<PaymentSearch />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
