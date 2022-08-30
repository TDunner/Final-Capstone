import React from "react";
import { useHistory } from "react-router";

export default function ReservationForm({
  formData,
  handleChange,
  handleSubmit,
}) {
  const history = useHistory();

  return (
    <div>
      <form name="reservation" onSubmit={handleSubmit}>
        <label htmlFor="first_name">First Name:</label>
        <input
          id="first_name"
          type="text"
          name="first_name"
          className="form-control my-2"
          onChange={handleChange}
          value={formData.first_name}
          placeholder="Enter the first name"
          required
        />
        <label htmlFor="last_name">Last Name:</label>
        <input
          id="last_name"
          type="text"
          name="last_name"
          className="form-control my-2"
          onChange={handleChange}
          value={formData.last_name}
          placeholder="Enter the last name"
          required
        />
        <label htmlFor="mobile_number">Mobile Number:</label>
        <input
          id="mobile_number"
          type="tel"
          name="mobile_number"
          className="form-control my-2"
          onChange={handleChange}
          value={formData.mobile_number}
          placeholder="Enter the mobile number"
          required
        />
        <label htmlFor="reservation_date">Reservation Date:</label>
        <input
          id="reservation_date"
          type="date"
          name="reservation_date"
          className="form-control my-2"
          onChange={handleChange}
          value={formData.reservation_date}
          required
        />
        <label htmlFor="reservation_time">Reservation Time:</label>
        <input
          id="reservation_time"
          type="time"
          name="reservation_time"
          className="form-control my-2"
          onChange={handleChange}
          value={formData.reservation_time}
          required
        />
        <label htmlFor="people">Set number of guests:</label>
        <input
          id="people"
          type="number"
          name="people"
          className="form-control my-2"
          onChange={handleChange}
          value={formData.people}
          required
        />
        <div className="form-group">
          <button
            className="btn btn-success btn-lg btn-block my-4"
            type="submit"
          >
            <i className="bi bi-check-lg" /> Submit
          </button>
          <button
            className="btn btn-danger btn-lg btn-block my-4"
            onClick={() => history.goBack()}
          >
            <i className="bi bi-x-lg" /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
