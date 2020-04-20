import React from 'react';
import { Route, Redirect } from 'react-router-dom';
// import auth from './common/auth';
export const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        // console.log("till here");

        if (localStorage.getItem('passwordResetToken')) {
          // console.log("in private route");
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: '/',
                state: {
                  from: props.location
                }
              }}
            />
          );
        }
      }}
    />
  );
};
