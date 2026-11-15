import Seat from "./Seat";

export default function SeatMap({
  config,
  passengers,
  activePassengerId,
  onSeatSelect,
}) {
  // Extract unique row numbers dynamically (e.g., [1, 2, 3, ..., 10])
  const rowNumbers = [...new Set(config.seats.map((seat) => seat.row))];
  const isTwoGroupLayout = config.groups.length === 2;

  return (
    <div className="flex flex-col items-center">
      {/* Legend Pill Bar */}
      <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-3 mb-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-emerald-50 border border-emerald-300 inline-block" />
          <span>Free (₹0)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-amber-50 border border-amber-300 inline-block" />
          <span>Paid (₹150–₹350)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-blue-600 inline-block" />
          <span>Active Passenger</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-indigo-100 border border-indigo-400 inline-block" />
          <span>Other Passenger</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-slate-200 border border-slate-300 inline-block" />
          <span>Occupied</span>
        </div>
      </div>

      {/* Aircraft Fuselage Body */}
      <div className="w-full overflow-x-auto pb-4 flex justify-center">
        <div className="relative bg-white border-2 border-slate-200/90 shadow-md rounded-t-[140px] rounded-b-[48px] px-6 sm:px-10 pt-10 pb-8 min-w-fit">
          {/* Cockpit Windshield & Label */}
          <div className="flex flex-col items-center mb-7">
            <div className="flex items-center gap-1.5 mb-2.5 opacity-80">
              <div className="w-9 h-3 bg-blue-200 rounded-tl-full rounded-tr-sm rounded-bl-sm -rotate-6" />
              <div className="w-9 h-3 bg-blue-200 rounded-tr-full rounded-tl-sm rounded-br-sm rotate-6" />
            </div>
            <span className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">
              Front • Cockpit
            </span>
          </div>

          {/* Column Headers (e.g., A B C   D E) */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center">
              {!isTwoGroupLayout && <div className="w-7" />}

              {config.groups.map((group, groupIndex) => (
                <div key={groupIndex} className="flex items-center">
                  <div className="flex gap-2">
                    {group.map((colLetter) => (
                      <div
                        key={colLetter}
                        className="w-12 sm:w-14 text-center text-xs font-bold text-slate-400"
                      >
                        {colLetter}
                      </div>
                    ))}
                  </div>

                  {/* Aisle Spacer between groups */}
                  {groupIndex < config.groups.length - 1 && (
                    <div className={isTwoGroupLayout ? "w-9" : "w-6"} />
                  )}
                </div>
              ))}
            </div>

            {/* Seat Rows Loop */}
            {rowNumbers.map((rowNum) => (
              <div key={rowNum} className="flex items-center">
                {/* Left Row Number for 3-group (2-3-2) widebody layout */}
                {!isTwoGroupLayout && (
                  <span className="w-7 text-xs font-bold text-slate-400 text-left select-none">
                    {rowNum}
                  </span>
                )}

                {config.groups.map((group, groupIndex) => (
                  <div key={groupIndex} className="flex items-center">
                    <div className="flex gap-2">
                      {group.map((colLetter) => {
                        const seatId = `${rowNum}${colLetter}`;
                        const seat = config.seats.find((s) => s.id === seatId);

                        const assignedPassenger = passengers.find(
                          (p) => p.seatId === seat.id
                        );

                        const isActivePassengerSeat =
                          assignedPassenger?.id === activePassengerId;

                        return (
                          <Seat
                            key={seat.id}
                            seat={seat}
                            assignedPassenger={assignedPassenger}
                            isActivePassengerSeat={isActivePassengerSeat}
                            onSelect={onSeatSelect}
                          />
                        );
                      })}
                    </div>

                    {/* Aisle Spacer (displays centered row number in 3-2 layout) */}
                    {groupIndex < config.groups.length - 1 && (
                      <div
                        className={`flex items-center justify-center ${
                          isTwoGroupLayout ? "w-9" : "w-6"
                        }`}
                      >
                        {isTwoGroupLayout && (
                          <span className="text-xs font-bold text-slate-400 select-none">
                            {rowNum}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Rear Galley & Lavatories Tail Section */}
          <div className="mt-8 pt-4 border-t border-dashed border-slate-200 text-center">
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
              Rear • Galley &amp; Lavatories
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}