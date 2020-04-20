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

const AddUser = (props) => {
  const { className, ...rest } = props;
  const { history } = props;
  const classes = useStyles();

  const [values, setValues] = useState({
    name: '',
    email: '',
    type: '',
    status: 'active'
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
  const handleAdd = (event) => {
    event.preventDefault();
    console.log('in adding');
    console.log(values);
    axios
      .post('http://localhost:5000/api/users/users/add', values)
      .then((res) => {
        if (res.data.error === false) {
          successMessage(true);
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
      <form autoComplete="off" onSubmit={handleAdd}>
        <CardHeader
          subheader="Enter details below"
          title="Add new Admin User "
        />
        <Divider />
        <CardContent>
          {success ? (
            <Alert
              onClose={() => {
                successMessage(false);
              }}
              className={classes.alert}>
              New Admin User has been added successfully
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
                value={values.firstName}
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
            Add User
          </Button>
          <Button color="primary" variant="outlined" onClick={handleBack}>
            Back
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

AddUser.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object
};

export default AddUser;
