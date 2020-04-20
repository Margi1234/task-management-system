import React, { Component } from 'react';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import axios from 'axios';
const styles = (theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '100%'
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
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: '25%'
  }
});

class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      newPassword: '',
      confirmPassword: '',
      passwordToken: '',
      passwordMatch: true,
      passwordChanged: false
    };
  }
  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  onSubmit = (e) => {
    e.preventDefault();
    var tkn = localStorage.getItem('passwordResetToken');
    // axios.get('http://localhost:5000/api/users/resetpassword')
    var data = {
      password: this.state.newPassword,
      tkn: tkn
    };
    if (this.state.newPassword === this.state.confirmPassword) {
      axios
        .post('http://localhost:5000/api/users/setpassword', data)
        .then((res) => {
          console.log(res.data);
          console.log('new password setting done');
          this.setState({ passwordMatch: true });

          this.setState({ passwordChanged: true });
          localStorage.removeItem('passwordResetToken');
        });
    } else {
      this.setState({ passwordMatch: false });
      console.log('passwords donot match');
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <p style={{ fontSize: '45px', marginBottom: '20px' }}>
              <b>Reset Password</b>
            </p>
            {!this.state.passwordMatch ? (
              <p style={{ color: 'red', textAlign: 'center' }}>
                Passwords donot match
              </p>
            ) : (
              ' '
            )}
            {this.state.passwordChanged ? (
              <div>
                <p style={{ color: 'green', textAlign: 'center' }}>
                  Your password has been successfully changed.
                </p>
                <Link to={'/sign-in'}>
                  <span
                    style={{
                      marginLeft: '0px !important',
                      fontSize: '15px',
                      textAlign: 'center'
                    }}>
                    &nbsp; Go to Sign-in
                  </span>
                </Link>
              </div>
            ) : (
              ' '
            )}
            <form
              className={classes.root}
              autoComplete="off"
              style={{ marginLeft: '-10px' }}
              onSubmit={this.onSubmit}>
              <TextField
                margin="normal"
                required
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
                onChange={this.onChange}
                value={this.state.password}
              />
              <TextField
                margin="normal"
                required
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                onChange={this.onChange}
                value={this.state.password}
              />
              <Button
                style={{ marginLeft: '7px' }}
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}>
                Submit{' '}
              </Button>
            </form>
          </div>
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(ResetPassword);
