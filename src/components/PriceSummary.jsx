import { CheckCircle2 } from "lucide-react";
import { MEAL_OPTIONS } from "../data/MockFlightData";

const BASE_FARE_PER_PASSENGER = 3500;

export default function PriceSummary({ passengers, seats, onConfirmBooking }) {
  // Calculate totals
  const baseTotal = passengers.length * BASE_FARE_PER_PASSENGER;

  const seatTotal = passengers.reduce((sum, p) => {
    const seat = seats.find((s) => s.id === p.seatId);
    return sum + (seat ? seat.price : 0);
  }, 0);

  const mealTotal = passengers.reduce((sum, p) => {
    const meal = MEAL_OPTIONS.find((m) => m.id === p.mealId);
    return sum + (meal ? meal.price : 0);
  }, 0);

  const grandTotal = baseTotal + seatTotal + mealTotal;
  const allSeatsSelected = passengers.every((p) => p.seatId !== null);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <h2 className="text-base font-bold text-slate-800 mb-4">Fare Summary</h2>

      <div className="space-y-2.5 text-sm border-b border-slate-100 pb-4 mb-4">
        <div className="flex justify-between text-slate-600">
          <span>
            Base Fare ({passengers.length} × ₹{BASE_FARE_PER_PASSENGER.toLocaleString()})
          </span>
          <span className="font-medium text-slate-800">
            ₹{baseTotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Seat Selection Charges</span>
          <span className="font-medium text-slate-800">
            {seatTotal === 0 ? "Free" : `₹${seatTotal.toLocaleString()}`}
          </span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>In-Flight Meals</span>
          <span className="font-medium text-slate-800">
            {mealTotal === 0 ? "Free" : `₹${mealTotal.toLocaleString()}`}
          </span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-base font-bold text-slate-800">Total Payable</span>
        <span className="text-2xl font-extrabold text-blue-600">
          ₹{grandTotal.toLocaleString()}
        </span>
      </div>

      {/* Confirm Button */}
      <button
        type="button"
        disabled={!allSeatsSelected}
        onClick={onConfirmBooking}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>
          {allSeatsSelected ? "Confirm Seat Selection" : "Select Seats for All Passengers"}
        </span>
      </button>
    </div>
  );
}