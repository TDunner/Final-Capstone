import React, { useState } from "react";
import { updateReservationStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { formatDate, formatTime, formatPhone } from "../utils/date-time";

export default function ReservationView({ reservation }) {
  const [showError, setShowError] = useState(null);

  async function handleCancel(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const message =
      "Do you want to cancel this reservation? This cannot be undone.";
    if (window.confirm(message)) {
      try {
        await updateReservationStatus(
          reservation.reservation_id,
          "cancelled",
          abortController.signal
        );
        window.location.reload(true);
      } catch (error) {
        if (error.name !== "AbortError") setShowError(error);
      }
    }
  }

  return (
    <div className="card bg-dark text-light align-items-center p-4 mb-4">
      <p data-reservation-id-status={reservation.reservation_id}>
        Status: {reservation.status.toUpperCase()}
      </p>
      <p>
        Name: {reservation.first_name}, {reservation.last_name}
      </p>
      <p>Mobile: {formatPhone(reservation.mobile_number)}</p>
      <p>Party Size: {reservation.people}</p>
      <p>Date: {formatDate(reservation.reservation_date)}</p>
      <p>Time: {formatTime(reservation.reservation_time)}</p>
      <div>
        <ErrorAlert error={showError} />
        {reservation.status === "booked" ? (
          <button className="btn btn-success my-3 mr-3 px-3 py-2">
            <a
              href={`/reservations/${reservation.reservation_id}/seat`}
              style={{ color: "white", textDecoration: "none" }}
            >
              <i className="bi bi-check-circle" /> Seat
            </a>
          </button>
        ) : null}
        <button className="btn btn-warning px-3 py-2">
          <a
            href={`/reservations/${reservation.reservation_id}/edit`}
            style={{ color: "white", textDecoration: "none" }}
          >
            <i className="bi bi-pencil-square" /> Edit
          </a>
        </button>
        <button
          className="btn btn-danger mx-3 px-3 py-2"
          data-reservation-id-cancel={reservation.reservation_id}
          onClick={handleCancel}
        >
          <i className="bi bi-x-circle" /> Cancel
        </button>
      </div>
    </div>
  );
}
