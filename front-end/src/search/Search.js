import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationView from "../reservations/ReservationView";

function Search() {
  const initial = {
    mobile_number: "",
  };
  const [form, setForm] = useState(initial);
  const [reservations, setReservations] = useState([]);
  const [showError, setShowError] = useState(null);

  useEffect(() => {
    const initialForm = {
      mobile_number: "",
    };
    setForm(initialForm);
    setReservations([]);
  }, []);

  function handleChange({ target }) {
    setForm({ ...form, [target.name]: target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const searchParameters = {
      mobile_number: form.mobile_number,
    };
    setForm(initial);
    setShowError(null);
    try {
      const response = await listReservations(
        searchParameters,
        abortController.signal
      );
      setReservations(response);
    } catch (error) {
      if (error.name !== "AbortError") setShowError(error);
    }
    return () => abortController.abort();
  }

  const searchResults =
    reservations.length > 0
      ? reservations.map((reservation) => (
          <ReservationView
            key={reservation.reservation_id}
            reservation={reservation}
          />
        ))
      : "No reservations found!";

  return (
    <div className="container fluid mt-3">
      <div className="h1 text-center">
        Search for Reservation by Mobile Number
      </div>
      <form className="d-flex flex-column my-4" onSubmit={handleSubmit}>
        <label htmlFor="mobile_number">Enter Mobile Number:</label>
        <div className="input-group mb-3">
          <input
            className="form-control"
            name="mobile_number"
            type="tel"
            onChange={handleChange}
          />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="submit">
              <i className="bi bi-search" /> Search
            </button>
          </div>
        </div>
      </form>

      <ErrorAlert error={showError} />
      <div className="text-center">{searchResults}</div>
    </div>
  );
}

export default Search;
