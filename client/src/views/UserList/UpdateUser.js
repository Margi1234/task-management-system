import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
const useStyles = makeStyles(() => ({
  root: {},
  alert: {
    marginBottom: '20px'
  }
}));

const UpdateUser = (props) => {
  const { className, ...rest } = props;
  const { history } = props;
  const classes = useStyles();

  const [values, setValues] = useState({
    name: localStorage.getItem('updateName'),
    email: localStorage.getItem('updateEmail'),
    type: localStorage.getItem('updateType'),
    status: localStorage.getItem('updateStatus'),
    id: localStorage.getItem('updateId')
  });
  const [success, successMessage] = useState(false);
  const handleBack = () => {
    history.goBack();
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };
  const handleUpdate = (event) => {
    event.preventDefault();
    console.log('in updating');
    console.log(values);
    axios
      .put('http://localhost:5000/api/users/updateUser', values)
      .then((res) => {
        if (res.status == 200) {
          successMessage(true);
          localStorage.removeItem('updateName');
          localStorage.removeItem('updateEmail');
          localStorage.removeItem('updateType');
          localStorage.removeItem('updateStatus');
          localStorage.removeItem('updateId');
        }
        console.log(res);
      });
  };
  const status = [
    {
      value: 'active',
      label: 'Active'
    },
    {
      value: 'inactive',
      label: 'Inactive'
    }
  ];

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <form autoComplete="off" onSubmit={handleUpdate}>
        <CardHeader subheader="Edit details below" title="Update Admin User " />
        <Divider />
        <CardContent>
          {success ? (
            <Alert
              onClose={() => {
                successMessage(false);
              }}
              className={classes.alert}>
              Admin User has been updated successfully
            </Alert>
          ) : (
            ''
          )}
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                type="text"
                // helperText="Please specify the name"
                label="Admin User Name"
                margin="dense"
                name="name"
                onChange={handleChange}
                required
                value={values.name}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                margin="dense"
                name="email"
                type="email"
                onChange={handleChange}
                required
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Type"
                margin="dense"
                name="type"
                onChange={handleChange}
                type="text"
                value={values.type}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Select Status"
                margin="dense"
                name="status"
                onChange={handleChange}
                required
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={values.status}
                variant="outlined">
                {status.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button color="primary" variant="contained" type="submit">
            Update User
          </Button>
          <Button color="primary" variant="outlined" onClick={handleBack}>
            Back
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};
UpdateUser.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object
};

export default UpdateUser;
