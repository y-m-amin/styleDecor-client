import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import axios from "../../api/axios";
import { toast } from "react-toastify";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const session_id = searchParams.get("session_id");

  useEffect(() => {
    if (!session_id) return;

    (async () => {
      try {
        // Call backend to verify and mark paid
        await axios.patch(`/payment-success?session_id=${session_id}`);

        toast.success("Payment successful! 🎉");
      } catch (err) {
        console.error("Failed to confirm payment", err);
        toast.error("Payment verification failed.");
      }
    })();
  }, [session_id]);

  const goToBookings = () => {
    navigate("/dashboard/my-bookings");
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Payment Successful!
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Thank you for your payment. Your booking is now confirmed.
      </p>
      <button
        onClick={goToBookings}
        className="btn btn-primary"
      >
        Go to My Bookings
      </button>
    </div>
  );
}
