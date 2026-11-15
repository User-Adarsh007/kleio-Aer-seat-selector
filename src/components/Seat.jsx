export default function Seat({ seat, assignedPassenger, isActivePassengerSeat, onSelect }) {
  const { id, price, category, isOccupied } = seat;

  // Determine the visual state and styling
  let buttonStyles = "";
  if (isOccupied) {
    // Occupied seat (disabled)
    buttonStyles = "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed";
  } else if (isActivePassengerSeat) {
    // Selected by the currently active passenger
    buttonStyles = "bg-blue-600 border-blue-700 text-white ring-2 ring-blue-300 shadow-sm";
  } else if (assignedPassenger) {
    // Selected by another passenger in the booking
    buttonStyles = "bg-indigo-100 border-indigo-400 text-indigo-800 hover:bg-indigo-200";
  } else if (price === 0) {
    // Available & Free (₹0)
    buttonStyles = "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 cursor-pointer";
  } else {
    // Available & Paid (₹150 - ₹350)
    buttonStyles = "bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 cursor-pointer";
  }

  return (
    <button
      type="button"
      disabled={isOccupied}
      onClick={() => onSelect(seat)}
      title={`${id} • ${category} • ${isOccupied ? "Occupied" : price === 0 ? "Free" : `₹${price}`}`}
      className={`relative flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg border text-xs font-semibold transition-all duration-150 ${buttonStyles}`}
    >
      {/* Passenger badge (e.g., P1, P2) when selected */}
      {assignedPassenger && (
        <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-900 text-white shadow">
          P{assignedPassenger.id}
        </span>
      )}

      {/* Seat ID (e.g., 1A) */}
      <span className="text-sm font-bold leading-tight">{id}</span>

      {/* Price or Status Label */}
      <span className="text-[10px] font-medium opacity-90">
        {isOccupied ? "Booked" : price === 0 ? "Free" : `₹${price}`}
      </span>
    </button>
  );
}