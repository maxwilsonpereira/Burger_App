import React, { useEffect, Suspense } from "react";
// Suspense is needed to when you use lazy() to lazy load.
// Wrap the Routes like this:
/*
<Suspense fallback={<p>Loading...</p>}>
  <Route path="/checkout" render={(props) => <Checkout {...props} />} />
  <Route path="/orders" render={(props) => <Orders {...props} />} />
</Suspense>;
*/

import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Logout from "./containers/Authentication/Logout/Logout";
import * as actions from "./store/actions/index";
// LAZY LOAD:
// It will render the component ONLY IF needed!
const Checkout = React.lazy(() => {
  return import("./containers/Checkout/Checkout");
});
const Orders = React.lazy(() => {
  return import("./containers/Orders/Orders");
});
const Authentication = React.lazy(() => {
  return import("./containers/Authentication/Authentication");
});

const app = (props) => {
  useEffect(() => {
    props.onTryAutoSignup();
  }, []);

  // Routes shown for NON Authenticated Users:
  let routes = (
    <Switch>
      <Route
        path="/authentication"
        render={(props) => <Authentication {...props} />}
      />
      <Route path="/" exact component={BurgerBuilder} />
      {/* REDIRECT = "/" will redirect any unknown path to "/" */}
      <Redirect to="/" />
    </Switch>
  );
  // Routes shown for Authenticated Users:
  if (props.isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/checkout" render={(props) => <Checkout {...props} />} />
        <Route path="/orders" render={(props) => <Orders {...props} />} />
        <Route path="/logout" component={Logout} />
        <Route
          path="/authentication"
          render={(props) => <Authentication {...props} />}
        />
        <Route path="/" exact component={BurgerBuilder} />
        {/* REDIRECT = "/" will redirect any unknown path to "/" */}
        <Redirect to="/" />
      </Switch>
    );
  }
  return (
    <div>
      <Layout>
        {/* You could render a Spinner on fallback. */}
        <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
      </Layout>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};
// withRouter must be used in this case, because we wraped (App)
// with connect. Route would not work anymore.
// withRouter() corrects this issue.
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(app));
