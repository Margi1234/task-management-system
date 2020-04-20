import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Button, TextField, Link, Typography } from '@material-ui/core';
import { Facebook as FacebookIcon, Google as GoogleIcon } from 'icons';
import axios from 'axios';
import auth from '../../common/auth';
const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage:
      'url("https://www.accumepartners.com/wp-content/uploads/2018/07/front-banner.jpg")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    position: 'relative'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px',
    position: 'absolute',
    top: '0',
    left: '0',
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '100%',
    width: '100%'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300,
    padding: '30% 0'
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(1)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
    // border: 'solid 1px black'
  },
  signInButton: {
    margin: theme.spacing(2, 0),
    backgroundColor: '#0E4681',
    color: 'white',
    boxShadow: 'none'
    // '&:hover': {
    //   backgroundColor: 'white',
    //   color: '#0E4681',
    //   border: 'solid 1px #0E4681',
    //   boxShadow: 'none'
    // }
  },
  errorMsg: {
    color: '#cc0000',
    marginBottom: '12px'
  }
});
class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {},
      errorsfront: {},
      touched: {},
      isError: false
    };
  }
  componentDidMount() {
    if (auth.isAuthenticated()) {
      this.props.history.push('/dashboard');
    }
  }
  handleTouch(e) {
    let { touched } = this.state;
    if (e.target.name && touched[e.target.name] !== true) {
      touched[e.target.name] = true;
      this.setState({
        touched
      });
    }
  }
  checkres = () => {
    if (this.state.errors.data.error === true) {
      this.setState({ isError: true });
    } else {
      auth.login(() => {
        this.props.history.push('/dashboard');
      });
    }
  };
  getUser = (userData, history) => {
    console.log(userData);
    axios
      .post('http://localhost:5000/api/users/login', userData)
      .then((res) => {
        this.setState({ errors: res });
        console.log(this.state.errors);
        this.checkres();
      });
  };
  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  validateForm() {
    let email = this.state.email;
    let password = this.state.password;
    // let fields = this.state.fields;
    let errorsfront = {};
    let formIsValid = true;
    // console.log(fields, 'fields');
    if (!email) {
      formIsValid = false;
      errorsfront['email'] = '*Please enter your email-ID.';
    }
    if (typeof email !== 'undefined') {
      //regular expression for email validation
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(email)) {
        formIsValid = false;
        errorsfront['email'] = '*Please enter a valid email.';
      }
    }
    if (!password) {
      formIsValid = false;
      errorsfront['password'] = '*Please enter your password.';
    }
    if (typeof password !== 'undefined') {
      if (password.length < 6) {
        formIsValid = false;
        errorsfront['password'] = '*Please enter secure and strong password.';
      }
    }
    this.setState({
      errorsfront: errorsfront
    });
    return formIsValid;
  }
  onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    console.log(userData);
    this.getUser(userData);
  };
  render() {
    const { classes } = this.props;
    const errors = this.state.errors;
    return (
      <div className={classes.root}>
        <Grid className={classes.grid} container>
          <Grid className={classes.quoteContainer} item lg={5}>
            <div className={classes.quote}>
              <div className={classes.quoteInner}>
                <Typography className={classes.quoteText} variant="h1">
                  Accume Partners is one of the most trusted providers of Risk &
                  Regulatory, IT Audit, and Cybersecurity & Privacy Solutions.
                </Typography>
              </div>
            </div>
          </Grid>
          <Grid className={classes.content} item lg={7} xs={12}>
            <div className={classes.content}>
              <div className={classes.contentBody}>
                <form className={classes.form} onSubmit={this.onSubmit}>
                  <Typography className={classes.title} variant="h2">
                    Sign in
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Sign in with social media
                  </Typography>
                  <Grid className={classes.socialButtons} container spacing={2}>
                    <Grid item>
                      <Button
                        color="primary"
                        // onClick={this.handleSignIn}
                        size="large"
                        variant="contained">
                        <FacebookIcon className={classes.socialIcon} />
                        Login with Facebook
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        // onClick={this.handleSignIn}
                        size="large"
                        variant="contained">
                        <GoogleIcon className={classes.socialIcon} />
                        Login with Google
                      </Button>
                    </Grid>
                  </Grid>
                  <Typography
                    align="center"
                    className={classes.sugestion}
                    color="textSecondary"
                    variant="body1">
                    or login with email address
                  </Typography>
                  <TextField
                    className={classes.textField}
                    id="email"
                    fullWidth
                    required
                    label="Email address"
                    name="email"
                    type="email"
                    variant="outlined"
                    onChange={this.onChange}
                    value={this.state.email}
                    error={errors.email}
                    onBlur={(e) => {
                      this.handleTouch(e);
                      this.validateForm();
                    }}
                  />
                  {this.state.touched.email ? (
                    <div className={classes.errorMsg}>
                      {this.state.errorsfront.email}
                    </div>
                  ) : (
                    ''
                  )}
                  {this.state.isError ? (
                    <p className={classes.errorMsg}>
                      {this.state.errors.data.email}
                    </p>
                  ) : (
                    ''
                  )}
                  <TextField
                    className={classes.textField}
                    fullWidth
                    variant="outlined"
                    required
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    onChange={this.onChange}
                    value={this.state.password}
                    onBlur={(e) => {
                      this.handleTouch(e);
                      this.validateForm();
                    }}
                    // error={errors.password}
                  />
                  {this.state.touched.password ? (
                    <div className={classes.errorMsg}>
                      {this.state.errorsfront.password}
                    </div>
                  ) : (
                    ''
                  )}

                  {this.state.isError ? (
                    <p className={classes.errorMsg}>
                      {this.state.errors.data.passwordincorrect}
                    </p>
                  ) : (
                    ''
                  )}
                  <Typography
                    color="textSecondary"
                    variant="body1"
                    style={{ marginTop: '10px' }}>
                    <Link
                      component={RouterLink}
                      to="/forgotpassword"
                      variant="h6">
                      Forgot Password?
                    </Link>
                  </Typography>
                  <Button
                    className={classes.signInButton}
                    color="primary"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained">
                    Sign in
                  </Button>
                  <Typography color="textSecondary" variant="body1">
                    Don't have an account?{' '}
                    <Link component={RouterLink} to="/sign-up" variant="h6">
                      Sign up
                    </Link>
                  </Typography>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}
export default withStyles(styles)(SignIn);
