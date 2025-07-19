import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import OrderSuccess from '../components/OrderSuccess';
import './css/OrderSuccessPage.css';

function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  useEffect(() => {
    if (!state?.order) {
      setTimeout(() => {
        toast.error('No order data found');
        // navigate('/');
        console.log(state)
      }, 0);
    }
  }, [state, navigate]);

  if (!state?.order) {
    return <p>Redirecting...</p>; // fallback UI    
  }

  return (
    <div className="order-success-page">
      <OrderSuccess order={state.order} />
    </div>
  );
}

export default OrderSuccessPage;
