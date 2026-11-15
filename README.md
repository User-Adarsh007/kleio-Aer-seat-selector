# ✈️ Kleio-Aer — Interactive Airline Cabin Seat Selector

A responsive flight seat selection and ancillary booking web application built with **React**, **Vite**, and **Tailwind CSS**. Designed around an aircraft fuselage cabin interface, **Kleio-Aer** supports dynamic aircraft configuration switching (`3-2` narrowbody vs. `2-3-2` widebody), multi-passenger seat and meal assignment, and real-time fare calculation.

- **GitHub Repository:** [github.com/User-Adarsh007/kleio-Aer-seat-selector](https://github.com/User-Adarsh007/kleio-Aer-seat-selector)
- **Live Demo (Vercel):** https://kleio-aer-seat-selector.vercel.app

---

## ✨ Key Features

- **Dynamic Aircraft Configurations:** Toggle seamlessly between a **3-2 Narrowbody** (`Airbus A220`, 10 rows / 50 seats) and a **2-3-2 Widebody** (`Boeing 767`, 8 rows / 56 seats), automatically adjusting column groups, aisle spacers, and row numbering.
- **Fuselage Cabin UI:** Custom rounded aircraft nosecone, cockpit windshield header, centered aisle row numbers, rear galley divider, and color-coded seat states (**Free ₹0**, **Paid ₹150–₹350**, **Active Passenger**, **Other Passenger**, and **Occupied**).
- **Multi-Passenger Management:** Add or remove up to 6 passengers (`P1`–`P6`), switch active passenger focus, and customize complimentary or paid in-flight meals per traveler.
- **Live Price Summary & Validation:** Real-time breakdown of Base Fare, Seat Selection Charges, and Meal Charges, with booking confirmation gated until every passenger is assigned a seat.

---

## 🧠 State Management & Seat Assignment Logic

### 1. Centralized Top-Down State (`src/App.jsx`)
All mutable booking state is lifted to the root `App` component using React `useState` hooks and passed down as props to presentational child components (`SeatMap`, `PassengerPanel`, `PriceSummary`):

- **`layoutId` (`"3-2"` | `"2-3-2"`):** Determines which aircraft configuration object (`FLIGHT_CONFIGS[layoutId]`) is active. Switching layouts clears all existing `seatId` assignments across passengers and resets focus to the first passenger so no traveler retains an invalid seat coordinate from the previous cabin map.
- **`passengers` (Array of Objects):** Tracks each traveler's `{ id, name, seatId, mealId }`. Keeping `seatId` on the passenger record (rather than mutating the static `mockFlightData.js` seat array) creates a single source of truth and makes multi-passenger conflict checks and fare reductions deterministic.
- **`activePassengerId` (Number):** Controls which passenger receives the next clicked seat on the cabin map.
- **`isConfirmed` (Boolean):** Toggles the final booking summary modal once all passengers pass seat-assignment validation (`passengers.every((p) => p.seatId !== null)`).

### 2. Seat Assignment & Auto-Advance Workflow (`handleSeatSelect`)
When a user clicks any seat button in `Seat.jsx`, the seat object is passed up to `handleSeatSelect(seat)` in `App.jsx`, which executes four checks in sequence:

1. **Occupancy Guard:** If `seat.isOccupied` is `true`, the click is ignored (`disabled` at the DOM level and guarded in state).
2. **Toggle Deselect:** If the currently active passenger clicks the seat already assigned to them (`activePassenger.seatId === seat.id`), their `seatId` is reset to `null`.
3. **Exclusive Reassignment:** Otherwise, `seat.id` is assigned to `activePassengerId`. If another passenger in the same booking previously held that seat (`p.seatId === seat.id`), their `seatId` is cleared to `null` so two passengers can never occupy the same seat.
4. **Smart Focus Auto-Advance:** After assigning a seat, the handler scans `updated.find((p) => p.seatId === null)` and automatically shifts `activePassengerId` to the next unassigned passenger, allowing rapid sequential seat selection across a group without manual card switching.

### 3. Dynamic Grid Rendering (`src/components/seatMap.jsx`)
Rather than hardcoding rows or seat positions, `SeatMap` derives unique row numbers dynamically (`[...new Set(config.seats.map((s) => s.row))]`) and maps over `config.groups` (e.g., `[["A", "B", "C"], ["D", "E"]]`) to render seat blocks separated by aisle spacers. For each coordinate (`${rowNum}${colLetter}`), it looks up the seat metadata and cross-references `passengers` to badge occupied group seats with `P1`, `P2`, etc.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React & custom SVG cabin graphics
- **Deployment:** Vercel

---

## 📁 Project Structure

```text
├── index.html                   # App title & custom airplane SVG favicon
├── src/
│   ├── App.jsx                  # Root state management, seat assignment & modal
│   ├── data/
│   │   └── mockFlightData.js    # Aircraft seat generators, pricing tiers & meals
│   └── components/
│       ├── seat.jsx             # Individual seat button & visual state styling
│       ├── seatMap.jsx          # Fuselage container, aisle spacers & row loops
│       ├── passengerPanel.jsx   # Passenger cards, active focus & meal selector
│       └── priceSummary.jsx     # Live fare calculation & confirmation trigger
