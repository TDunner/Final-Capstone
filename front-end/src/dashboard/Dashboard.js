import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import useQuery from "../utils/useQuery";
import { listReservations, listTables } from "../utils/api";
import { next, previous, today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import TableView from "../tables/TableView";
import ReservationView from "../reservations/ReservationView";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [showError, setShowError] = useState(null);
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const query = useQuery();

  useEffect(() => {
    function updateDate() {
      const queryDate = query.get("date");
      if (queryDate) {
        setDate(queryDate);
      } else {
        setDate(today());
      }
    }
    updateDate();
  }, [query, routeMatch, setDate]);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setShowError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setShowError);
    return () => abortController.abort();
  }

  const reservationList = reservations.map((reservation) => {
    if (
      reservation.status === "cancelled" ||
      reservation.status === "finished"
    ) {
      return null;
    }
    return (
      <ReservationView
        key={reservation.reservation_id}
        reservation={reservation}
      />
    );
  });

  const tablesList = tables.map((table) => (
    <div className="col-md-6 colo-lg-3 mb-3">
      <TableView key={table.table_id} table={table} />
    </div>
  ));

  const handleDateChange = (event) => {
    setDate(event.target.value);

    history.push({
      pathname: routeMatch.url,
      search: `?date=${event.target.value}`,
    });
  };

  return (
    <div className="container fluid my-3 text-center">
      <h1>Dashboard</h1>
      <div>
        <h2>Reservations for {date}</h2>
        <button
          className="btn btn-secondary mr-2"
          onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
        >
          <i className="bi bi-chevron-double-left" /> Previous
        </button>
        <button
          className="btn btn-primary m-1"
          onClick={() => history.push(`/dashboard?date=${today()}`)}
        >
          Today
        </button>
        <button
          className="btn btn-secondary ml-2"
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
        >
          Next <i className="bi bi-chevron-double-right" />
        </button>
        <div>
          <label htmlFor="reservation_date" className="form-label m-3">
            <input
              type="date"
              pattern="\d{4}-\d{2}-\d{2}"
              name="reservation_date"
              onChange={handleDateChange}
              value={date}
            />
          </label>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      {reservationList.length > 0 ? (
        <div>
          <div className="h3 mt-4 text-center">RESERVATION LIST</div>
          <hr />
          <div>{reservationList}</div>
        </div>
      ) : (
        <p className="mt-4 text-center">No reservations found!</p>
      )}

      <ErrorAlert error={showError} />

      {tablesList.length > 0 ? (
        <div>
          <div className="h3 mt-4">TABLE LIST</div>
          <hr />
          <div>
            <div className="row">{tablesList}</div>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-center">No tables found!</p>
      )}
    </div>
  );
}

export default Dashboard;
