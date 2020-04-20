import React, { Component } from 'react';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
const styles = (theme) => ({
  root: {
    // border: 'solid 1px #cecece',
    // padding: '0 20px',
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
      marginTop: '20px'
    }
  },
  paper: {
    marginTop: theme.spacing(8)
  },
  input: {
    border: 'none !important',
    margin: '0px !important'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: '30px',
    display: 'flex'
  },
  title: {
    marginTop: theme.spacing(3),
    textAlign: 'center'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: '25%'
  }
});

class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      token: 'null',
      mailSent: false
    };
  }
  componentDidMount() {}
  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log('email is ', this.state.email);
    const userEmail = { email: this.state.email };

    axios
      .post('http://localhost:5000/api/users/passwordreset', userEmail)
      .then((res) => {
        console.log('password reset token', res.data);
        localStorage.setItem('passwordResetToken', res.data);
        this.setState({ mailSent: true });
      });
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Container component="main" maxWidth="xs" className={classes.cont}>
          <div className={classes.paper}>
            <Typography className={classes.title} variant="h2">
              Reset Password
            </Typography>
            {this.state.mailSent ? (
              <p style={{ color: 'green', textAlign: 'center' }}>
                We sent a recovery link to your mail address
              </p>
            ) : (
              ' '
            )}
            <form className={classes.root} onSubmit={this.handleSubmit}>
              <TextField
                required
                fullWidth
                variant="outlined"
                id="email"
                label="Email Address"
                name="email"
                type="email"
                onChange={this.onChange}
                value={this.state.email}
              />
              <Button
                style={{ marginLeft: '7px', width: '102%' }}
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}>
                Reset My Password{' '}
              </Button>
            </form>
          </div>
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(ForgotPassword);
