import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function TableForm() {
  const initialState = {
    table_name: "",
    capacity: 0,
  };
  const [formData, setFormData] = useState(initialState);
  const [showError, setShowError] = useState(null);
  const abortController = new AbortController();
  const history = useHistory();

  useEffect(() => {
    const initialForm = {
      table_name: "",
      capacity: 0,
    };
    setFormData(initialForm);
  }, []);

  function handleChange({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const newTable = {
      capacity: Number(formData.capacity),
      table_name: formData.table_name,
    };
    setShowError(null);
    try {
      await createTable(newTable, abortController.signal);
      setFormData(initialState);
      history.push("/dashboard");
    } catch (error) {
      setShowError(error);
    }
    return () => abortController.abort();
  }

  return (
    <div className="container fluid mt-3">
      <ErrorAlert error={showError} />
      <div className="h1 text-center">New Table</div>
      <form className="d-flex flex-column" onSubmit={handleSubmit}>
        <label htmlFor="table_name">
          Table Name:
          <input
            className="form-control my-2"
            name="table_name"
            type="text"
            min={2}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="capacity">
          Table Capacity:
          <input
            className="form-control my-2"
            name="capacity"
            type="number"
            onChange={handleChange}
          />
        </label>
        <div className="form-group">
          <button
            className="btn btn-success btn-lg btn-block my-2"
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
