import React, { useState } from "react";
import { deleteTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function TableView({ table }) {
  const { capacity, reservation_id, table_id, table_name } = table;

  const [showError, setShowError] = useState(null);

  async function handleClick(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const message =
      "Is this table ready to seat new guests? This cannot be undone.";
    setShowError(null);
    if (window.confirm(message)) {
      try {
        await deleteTable(table_id, abortController.signal);
        window.location.reload(true);
      } catch (error) {
        if (error.name !== "AbortError") setShowError(error);
      }
      return () => abortController.abort();
    }
  }

  const buttonSet = reservation_id ? (
    <div className="d-flex justify-content-center m-3">
      <button
        className="btn btn-danger"
        data-table-id-finish={table_id}
        onClick={handleClick}
      >
        Finish
      </button>
    </div>
  ) : (
    <></>
  );

  return (
    <div className="">
      <ErrorAlert error={showError} />
      <div className="col">
        <div className="card border-dark mb-3">
          <div className="h5 card-header">
            <i className="bi bi-x-diamond" /> Table Name: {table_name}
          </div>
          <div className="h6 text-center mt-2">Capacity: {capacity}</div>
          <div className="h6 m-3 text-center" data-table-id-status={table_id}>
            Status: {reservation_id ? "occupied" : "free"}
          </div>
          {buttonSet}
        </div>
      </div>
    </div>
  );
}
