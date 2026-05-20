import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Payments from './pages/Payments';
import PaymentDetails from './pages/PaymentDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="payments" element={<Payments />} />
          <Route path="payments/:id" element={<PaymentDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
