import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

export default function EditReservation() {
  const initial = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    people: 0,
    reservation_date: "",
    reservation_time: "",
    status: "",
  };
  const [formData, setFormData] = useState({ ...initial });
  const [showError, setShowError] = useState(false);
  const abortController = new AbortController();
  const history = useHistory();
  const { reservation_id } = useParams();
  const resId = parseInt(reservation_id);

  useEffect(() => {
    const abort = new AbortController();
    const initialReservation = {
      first_name: "",
      last_name: "",
      mobile_number: "",
      people: 0,
      reservation_id: "",
      reservation_date: "",
      reservation_time: "",
      status: "",
    };

    async function getReservation() {
      try {
        const response = await readReservation(resId, abort.signal);
        initialReservation.first_name = response.first_name;
        initialReservation.last_name = response.last_name;
        initialReservation.mobile_number = response.mobile_number;
        initialReservation.people = parseInt(response.people);
        initialReservation.reservation_id = parseInt(response.reservation_id);
        initialReservation.reservation_date = formatDate(
          response.reservation_date
        );
        initialReservation.reservation_time = formatTime(
          response.reservation_time
        );
        setFormData({ ...initialReservation });
      } catch (error) {
        if (error.name !== "AbortError") setShowError(error);
      }
    }
    getReservation();

    return () => abort.abort();
  }, [resId]);

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
    setShowError(false);
    const updatedRes = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      mobile_number: formData.mobile_number,
      people: Number(formData.people),
      reservation_id: resId,
      reservation_date: formData.reservation_date,
      reservation_time: formData.reservation_time,
      status: "booked",
    };
    try {
      await updateReservation(updatedRes, abortController.signal);
      history.push(`/dashboard?date=${updatedRes.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") setShowError(error);
    }

    return () => {
      abortController.abort();
    };
  }

  return (
    <div className="container fluid">
      <h3 className="my-3 text-center">Create New Reservation</h3>
      <ErrorAlert error={showError} />
      <ReservationForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
