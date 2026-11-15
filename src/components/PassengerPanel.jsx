import { UserPlus, Trash2, Utensils, Armchair } from "lucide-react";
import { MEAL_OPTIONS } from "../data/MockFlightData";
export default function PassengerPanel({
  passengers,
  activePassengerId,
  onSelectActivePassenger,
  onAddPassenger,
  onRemovePassenger,
  onMealChange,
  seats,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      {/* Header + Add Button */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">Passengers</h2>
          <p className="text-xs text-slate-500">
            Click a passenger card, then pick their seat
          </p>
        </div>

        <button
          type="button"
          onClick={onAddPassenger}
          disabled={passengers.length >= 6}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Passenger Cards List */}
      <div className="space-y-3">
        {passengers.map((passenger) => {
          const isActive = passenger.id === activePassengerId;
          const selectedSeat = seats.find((s) => s.id === passenger.seatId);

          return (
            <div
              key={passenger.id}
              onClick={() => onSelectActivePassenger(passenger.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                  : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
              }`}
            >
              {/* Top Row: Name + Selected Seat Badge + Delete */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    P{passenger.id}
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {passenger.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Seat Status Pill */}
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                      selectedSeat
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    <Armchair className="w-3 h-3" />
                    {selectedSeat
                      ? `${selectedSeat.id} (${
                          selectedSeat.price === 0 ? "Free" : `₹${selectedSeat.price}`
                        })`
                      : "No seat"}
                  </span>

                  {/* Remove Passenger Button (only if > 1 passenger) */}
                  {passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering card click
                        onRemovePassenger(passenger.id);
                      }}
                      title="Remove passenger"
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Meal Selector Dropdown */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2"
              >
                <Utensils className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={passenger.mealId}
                  onChange={(e) => onMealChange(passenger.id, e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-blue-500"
                >
                  {MEAL_OPTIONS.map((meal) => (
                    <option key={meal.id} value={meal.id}>
                      {meal.name} ({meal.price === 0 ? "Free" : `+₹${meal.price}`})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}