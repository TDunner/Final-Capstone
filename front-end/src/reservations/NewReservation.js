import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";

export default function NewReservation() {
  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    people: 0,
    reservation_date: "",
    reservation_time: "",
    status: "",
  };
  const [formData, setFormData] = useState({ ...initialState });
  const [showError, setShowError] = useState(null);
  const abortController = new AbortController();
  const history = useHistory();

  function formatDate(date) {
    let formatedDate = date.split("");
    formatedDate.splice(10);
    formatedDate = formatedDate.join("");
    return formatedDate;
  }

  function formatTime(time) {
    let formatedTime = time.split("");
    formatedTime.splice(5);
    formatedTime = formatedTime.join("");
    return formatedTime;
  }

  function handleChange({ target }) {
    const { name, value } = target;
    switch (name) {
      case "people":
        setFormData({ ...formData, [name]: parseInt(value) });
        break;
      case "reservation_date":
        setFormData({ ...formData, [name]: formatDate(value) });
        break;
      case "reservation_time":
        setFormData({ ...formData, [name]: formatTime(value) });
        break;
      default:
        setFormData({ ...formData, [name]: value });
        break;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setShowError(null);

    const newReservation = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      mobile_number: formData.mobile_number,
      people: Number(formData.people),
      reservation_date: formData.reservation_date,
      reservation_time: formData.reservation_time,
      status: "booked",
    };

    try {
      await createReservation(newReservation, abortController.signal);
      setFormData({ ...initialState });
      history.push(`/dashboard?date=${newReservation.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") setShowError(error);
    }

    return () => abortController.abort();
  }

  return (
    <div className="container fluid mt-3">
      <ErrorAlert error={showError} />
      <div className="h1 text-center">New Reservation Form</div>
      <ReservationForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
