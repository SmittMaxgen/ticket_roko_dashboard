// src/features/seats/seatSelectors.js
export const selectSeatList = (state) => state.seats.list;
export const selectSeatLoading = (state) => state.seats.loading;
export const selectSeatActionLoading = (state) => state.seats.actionLoading;
export const selectSeatError = (state) => state.seats.error;
export const selectCurrentSeat = (state) => state.seats.current;

// Grouped by row_label — ready for grid rendering
export const selectSeatsByRow = (state) => {
  const rows = {};
  [...state.seats.list]
    .sort(
      (a, b) =>
        a.row_label.localeCompare(b.row_label) || a.col_index - b.col_index,
    )
    .forEach((seat) => {
      const key = seat.row_label || "__AISLE__";
      if (!rows[key]) rows[key] = [];
      rows[key].push(seat);
    });
  return rows;
};

// Unique section labels with colors from seats
export const selectSectionSummary = (state) => {
  const map = {};
  state.seats.list
    .filter((s) => !s.is_space)
    .forEach((seat) => {
      const key = seat.section_label || "General";
      if (!map[key])
        map[key] = {
          label: key,
          color: seat.fill,
          count: 0,
          price: seat.price,
        };
      map[key].count++;
    });
  return Object.values(map);
};

// Count of selected seats
export const selectSelectedSeats = (state) =>
  state?.seats?.list?.filter((s) => s.status === "selected");

// Total price of selected
export const selectSelectedTotal = (state) =>
  state?.seats?.list
    .filter((s) => s.status === "selected")
    .reduce((a, s) => a + Number(s.price || 0), 0);

// Bookable seats only (no spaces)
export const selectBookableSeats = (state) =>
  state.seats.list.filter((s) => !s.is_space && s.is_active);
