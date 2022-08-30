import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { listTables, readReservation, seatReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function SeatTable() {
  const initialState = { table_id: "" };
  const [form, setForm] = useState(initialState);
  const [reservation, setReservation] = useState({ people: 0 });
  const [showError, setShowError] = useState(null);
  const [tables, setTables] = useState([]);
  const { reservation_id } = useParams();
  const abortController = new AbortController();
  const history = useHistory();

  useEffect(() => {
    const abort = new AbortController();
    const initialForm = { table_id: "" };
    setForm(initialForm);

    async function getReservation() {
      try {
        const response = await readReservation(reservation_id, abort.signal);
        setReservation(response);
      } catch (error) {
        if (error.name !== "AbortError") setShowError(error);
      }
    }

    async function getTables() {
      try {
        const response = await listTables(abort.signal);
        setTables(response);
      } catch (error) {
        if (error.name !== "AbortError") setShowError(error);
      }
    }
    getReservation();
    getTables();
    return () => abort.abort();
  }, [reservation_id]);

  function handleChange({ target }) {
    setForm({ ...form, [target.name]: target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const table_id = Number(form.table_id);
    const reservation = parseInt(reservation_id);
    setShowError(null);
    setForm(initialState);
    try {
      await seatReservation(reservation, table_id, abortController.signal);
      history.push("/dashboard");
    } catch (error) {
      if (error.name !== "AbortError") setShowError(error);
    }
    return () => abortController.abort();
  }

  const tableOptions = tables.map((table) => {
    const disabled = Number(table.capacity) < Number(reservation.people);

    const optionColor = () => {
      if (reservation.people > table.capacity) {
        return "red";
      } else {
        return "black";
      }
    };

    return (
      <option
        key={table.table_id}
        value={table.table_id}
        disabled={disabled}
        style={{ color: optionColor() }}
      >
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  return (
    <div className="container fluid my-3">
      <ErrorAlert error={showError} />
      <div className="h1 text-center">Seat Reservation</div>
      <div className="h5 card border bg-dark text-light d-flex flex-column align-items-center p-2">
        <div data-reservation-id-status={reservation.reservation_id}>
          Status: {reservation.status}
        </div>
        <div>
          Name: {reservation.first_name}, {reservation.last_name}
        </div>
        <div>Mobile: {reservation.mobile_number}</div>
        <div>Party Size: {reservation.people}</div>
        <div>Date: {reservation.reservation_date}</div>
        <div>Time: {reservation.reservation_time}</div>
      </div>
      <form className="d-flex flex-column mt-4" onSubmit={handleSubmit}>
        <label htmlFor="table_id">Select Table:</label>
        <select
          className="form-control"
          name="table_id"
          onChange={handleChange}
        >
          <option>--Please Choose a Table--</option>
          {tableOptions}
        </select>
        <div className="form-group">
          <button
            className="btn btn-success btn-lg btn-block my-3"
            type="submit"
          >
            <i className="bi bi-check-lg" /> Submit
          </button>
          <button
            className="btn btn-danger btn-lg btn-block my-3"
            onClick={() => history.goBack()}
          >
            <i className="bi bi-x-lg" /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
