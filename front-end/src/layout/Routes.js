import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import Search from "../search/Search";
import SeatTable from "../tables/SeatTable";
import TableForm from "../tables/TableForm";
import NewReservation from "../reservations/NewReservation";
import EditReservation from "../reservations/EditReservation";
/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [date, setDate] = useState(today());

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatTable />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route path="/tables/new">
        <TableForm />
      </Route>
      <Route exact={true} path="/tables">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} setDate={setDate} />
      </Route>
      <Route exact={true} path="/search">
        <Search />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
