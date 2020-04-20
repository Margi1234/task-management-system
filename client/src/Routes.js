import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Dashboard as DashboardView,
  ProductList as ProductListView,
  UserList as UserListView,
  Typography as TypographyView,
  Icons as IconsView,
  Account as AccountView,
  Settings as SettingsView,
  SignUp as SignUpView,
  SignIn as SignInView,
  NotFound as NotFoundView
} from './views';
import AccountCreated from './views/SignUp/AccountCreated';
import ForgotPassword from './views/SignIn/ForgotPassword';
import ResetPassword from './views/SignIn/ResetPassword';
import AddUser from './views/UserList/AddUser';
import UpdateUser from './views/UserList/UpdateUser';
const Routes = () => {
  return (
    <Switch>
      <Redirect exact from="/" to="/sign-in" />
      <RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        path="/users"
      />
      <RouteWithLayout
        component={ProductListView}
        exact
        layout={MainLayout}
        path="/products"
      />
      <RouteWithLayout
        component={TypographyView}
        exact
        layout={MainLayout}
        path="/typography"
      />
      <RouteWithLayout
        component={IconsView}
        exact
        layout={MainLayout}
        path="/icons"
      />
      <RouteWithLayout
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account"
      />
      <RouteWithLayout
        component={SettingsView}
        exact
        layout={MainLayout}
        path="/settings"
      />
      <RouteWithLayout
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/sign-up"
      />
      <RouteWithLayout
        component={AccountCreated}
        exact
        layout={MinimalLayout}
        path="/accountcreated"
      />
      <RouteWithLayout
        component={ForgotPassword}
        exact
        layout={MinimalLayout}
        path="/forgotpassword"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <RouteWithLayout
        path="/resetpassword"
        component={ResetPassword}
        layout={MinimalLayout}
      />
      <PrivateRoute
        path="/resetpassword"
        component={ResetPassword}
        layout={MinimalLayout}
      />
      <RouteWithLayout
        path="/users/add"
        component={AddUser}
        layout={MainLayout}
      />
      <RouteWithLayout
        path="/users/update"
        component={UpdateUser}
        layout={MainLayout}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
