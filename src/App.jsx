import { useState } from "react";
import { Plane, RotateCcw, CheckCircle2, X } from "lucide-react";
import { FLIGHT_CONFIGS, MEAL_OPTIONS } from "./data/MockFlightData";
import SeatMap from "./components/SeatMap";
import PassengerPanel from "./components/PassengerPanel";
import PriceSummary from "./components/PriceSummary";

const INITIAL_PASSENGERS = [
  { id: 1, name: "Passenger 1", seatId: null, mealId: "none" },
  { id: 2, name: "Passenger 2", seatId: null, mealId: "none" },
];

export default function App() {
  const [layoutId, setLayoutId] = useState("3-2");
  const [passengers, setPassengers] = useState(INITIAL_PASSENGERS);
  const [activePassengerId, setActivePassengerId] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const currentConfig = FLIGHT_CONFIGS[layoutId];

  // Switch between 3-2 and 2-3-2 layouts
  const handleLayoutChange = (newLayoutId) => {
    if (newLayoutId === layoutId) return;
    setLayoutId(newLayoutId);
    // Reset seat selections since seat maps differ between aircraft
    setPassengers((prev) => prev.map((p) => ({ ...p, seatId: null })));
    setActivePassengerId(passengers[0]?.id || 1);
    setIsConfirmed(false);
  };

  // Handle clicking a seat on the map
  const handleSeatSelect = (seat) => {
    if (seat.isOccupied) return;

    setPassengers((prevPassengers) => {
      const activePassenger = prevPassengers.find(
        (p) => p.id === activePassengerId
      );

      // 1. If active passenger clicks their own seat -> deselect it
      if (activePassenger?.seatId === seat.id) {
        return prevPassengers.map((p) =>
          p.id === activePassengerId ? { ...p, seatId: null } : p
        );
      }

      // 2. Otherwise assign seat to active passenger (and clear it if another passenger held it)
      const updated = prevPassengers.map((p) => {
        if (p.id === activePassengerId) {
          return { ...p, seatId: seat.id };
        }
        if (p.seatId === seat.id) {
          return { ...p, seatId: null };
        }
        return p;
      });

      // 3. Auto-advance active focus to the next passenger without a seat
      const nextUnassigned = updated.find((p) => p.seatId === null);
      if (nextUnassigned) {
        setActivePassengerId(nextUnassigned.id);
      }

      return updated;
    });
  };

  // Add a new passenger (up to 6)
  const handleAddPassenger = () => {
    if (passengers.length >= 6) return;
    const nextId = Math.max(...passengers.map((p) => p.id)) + 1;
    const newPassenger = {
      id: nextId,
      name: `Passenger ${nextId}`,
      seatId: null,
      mealId: "none",
    };
    setPassengers((prev) => [...prev, newPassenger]);
    setActivePassengerId(nextId);
  };

  // Remove a passenger
  const handleRemovePassenger = (idToRemove) => {
    if (passengers.length <= 1) return;
    const remaining = passengers.filter((p) => p.id !== idToRemove);
    setPassengers(remaining);

    if (activePassengerId === idToRemove) {
      setActivePassengerId(remaining[0].id);
    }
  };

  // Update meal selection for a passenger
  const handleMealChange = (passengerId, mealId) => {
    setPassengers((prev) =>
      prev.map((p) => (p.id === passengerId ? { ...p, mealId } : p))
    );
  };

  // Reset entire booking
  const handleReset = () => {
    setPassengers(INITIAL_PASSENGERS);
    setActivePassengerId(1);
    setIsConfirmed(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-12">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-xl">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Kleio-Aer
              </h1>
              <p className="text-xs text-slate-500">
                Flight KP-204 • BOM → ZRH
              </p>
            </div>
          </div>

          {/* Aircraft Layout Toggle + Reset */}
          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              {Object.keys(FLIGHT_CONFIGS).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleLayoutChange(key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    layoutId === key
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {key} Layout
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleReset}
              title="Reset selections"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Aircraft: <span className="text-slate-800">{currentConfig.name}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Interactive Seat Map (7 columns on desktop) */}
          <div className="lg:col-span-7">
            <SeatMap
              config={currentConfig}
              passengers={passengers}
              activePassengerId={activePassengerId}
              onSeatSelect={handleSeatSelect}
            />
          </div>

          {/* Right: Passenger Management & Price Summary (5 columns on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            <PassengerPanel
              passengers={passengers}
              activePassengerId={activePassengerId}
              onSelectActivePassenger={setActivePassengerId}
              onAddPassenger={handleAddPassenger}
              onRemovePassenger={handleRemovePassenger}
              onMealChange={handleMealChange}
              seats={currentConfig.seats}
            />

            <PriceSummary
              passengers={passengers}
              seats={currentConfig.seats}
              onConfirmBooking={() => setIsConfirmed(true)}
            />
          </div>
        </div>
      </main>

      {/* Booking Confirmation Modal */}
      {isConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
                <h3 className="text-lg font-bold text-slate-900">
                  Seats Confirmed!
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmed(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Aircraft: <strong className="text-slate-700">{currentConfig.name}</strong>
            </p>

            <div className="space-y-2.5 mb-6">
              {passengers.map((p) => {
                const seat = currentConfig.seats.find((s) => s.id === p.seatId);
                const meal = MEAL_OPTIONS.find((m) => m.id === p.mealId);
                return (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{p.name}</p>
                      <p className="text-slate-500 mt-0.5">{meal?.name}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold">
                      Seat {seat?.id}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsConfirmed(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}