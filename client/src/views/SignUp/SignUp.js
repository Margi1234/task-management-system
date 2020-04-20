import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button, TextField, Link, Typography } from '@material-ui/core';
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
  textField: {
    marginTop: theme.spacing(2)
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  signUpButton: {
    margin: theme.spacing(2, 0)
  },
  errorMsg: {
    color: '#cc0000'
    // marginBottom: '12px'
  }
});

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmpassword: '',
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
  validateForm() {
    let name = this.state.name;
    let email = this.state.email;
    let password = this.state.password;

    let confirmpassword = this.state.confirmpassword;
    let errorsfront = {};
    let formIsValid = true;
    // console.log(fields, 'fields');
    if (!name) {
      formIsValid = false;
      errorsfront['name'] = '*Please enter your username.';
    }
    if (typeof name !== 'undefined') {
      if (!name.match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errorsfront['name'] = '*Please enter alphabet characters only.';
      }
    }
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
    if (!confirmpassword) {
      formIsValid = false;
      errorsfront['confirmpassword'] = '*Please enter your password.';
    }
    if (password !== confirmpassword) {
      formIsValid = false;
      errorsfront['confirmpassword'] = '*Passwords donot match';
    }
    this.setState({
      errorsfront: errorsfront
    });
    return formIsValid;
  }
  checkres = () => {
    console.log(this.state.errors.data.error);
    if (this.state.errors.data.error === false) {
      auth.register(() => {
        console.log('hello');
      });
      this.props.history.push('/accountcreated');
    } else {
      this.setState({ isError: true });
    }
  };
  registerUser = (userData, history) => {
    console.log(userData);
    axios
      .post('http://localhost:5000/api/users/register', userData)
      .then((res) => {
        this.setState({ errors: res });
        console.log('errors ', this.state.errors);
        this.checkres();
      });
  };
  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  onSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.confirmpassword
    };
    console.log(newUser);
    this.registerUser(newUser);
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
                    Create new account
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Use your email to create new account
                  </Typography>
                  <TextField
                    className={classes.textField}
                    fullWidth
                    type="text"
                    variant="outlined"
                    id="name"
                    label="Name"
                    name="name"
                    required
                    value={this.state.value}
                    onChange={this.onChange}
                    error={errors.name}
                    onBlur={(e) => {
                      this.handleTouch(e);
                      this.validateForm();
                    }}
                  />
                  {this.state.touched.name ? (
                    <div className={classes.errorMsg}>
                      {this.state.errorsfront.name}
                    </div>
                  ) : (
                    ''
                  )}
                  {this.state.isError ? (
                    <p className={classes.errorMsg}>
                      {this.state.errors.data.name}
                    </p>
                  ) : (
                    ''
                  )}
                  <TextField
                    className={classes.textField}
                    fullWidth
                    variant="outlined"
                    label="Email"
                    required
                    id="email"
                    type="email"
                    name="email"
                    value={this.state.value}
                    onChange={this.onChange}
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
                    value={this.state.value}
                    onChange={this.onChange}
                    error={errors.password}
                    onBlur={(e) => {
                      this.handleTouch(e);
                      this.validateForm();
                    }}
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
                      {this.state.errors.data.password}
                    </p>
                  ) : (
                    ''
                  )}
                  <TextField
                    className={classes.textField}
                    fullWidth
                    variant="outlined"
                    required
                    name="confirmpassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmpassword"
                    value={this.state.value}
                    onChange={this.onChange}
                    error={errors.confirmpassword}
                    onBlur={(e) => {
                      this.handleTouch(e);
                      this.validateForm();
                    }}
                  />
                  {this.state.touched.confirmpassword ? (
                    <div className={classes.errorMsg}>
                      {this.state.errorsfront.confirmpassword}
                    </div>
                  ) : (
                    ''
                  )}
                  {this.state.isError ? (
                    <p className={classes.errorMsg}>
                      {this.state.errors.data.confirmpassword}
                    </p>
                  ) : (
                    ''
                  )}
                  <Button
                    className={classes.signUpButton}
                    color="primary"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained">
                    Sign up now
                  </Button>
                  <Typography color="textSecondary" variant="body1">
                    Have an account?{' '}
                    <Link component={RouterLink} to="/sign-in" variant="h6">
                      Sign in
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

export default withStyles(styles)(SignUp);

// const SignUp = (props) => {
//   const { history } = props;

//   const classes = useStyles();

//   return (
//     <div className={classes.root}>
//       <Grid className={classes.grid} container>
//         <Grid className={classes.quoteContainer} item lg={5}>
//           <div className={classes.quote}>
//             <div className={classes.quoteInner}>
//               <Typography className={classes.quoteText} variant="h1">
//                 Accume Partners is one of the most trusted providers of Risk &
//                 Regulatory, IT Audit, and Cybersecurity & Privacy Solutions.
//               </Typography>
//             </div>
//           </div>
//         </Grid>
//         <Grid className={classes.content} item lg={7} xs={12}>
//           <div className={classes.content}>
//             <div className={classes.contentBody}>
//               <form className={classes.form} onSubmit={handleSignUp}>
//                 <Typography className={classes.title} variant="h2">
//                   Create new account
//                 </Typography>
//                 <Typography color="textSecondary" gutterBottom>
//                   Use your email to create new account
//                 </Typography>
//                 <TextField
//                   className={classes.textField}
//                   error={hasError('firstName')}
//                   fullWidth
//                   helperText={
//                     hasError('firstName') ? formState.errors.firstName[0] : null
//                   }
//                   label="First name"
//                   name="firstName"
//                   onChange={handleChange}
//                   type="text"
//                   value={formState.values.firstName || ''}
//                   variant="outlined"
//                 />
//                 <TextField
//                   className={classes.textField}
//                   error={hasError('lastName')}
//                   fullWidth
//                   helperText={
//                     hasError('lastName') ? formState.errors.lastName[0] : null
//                   }
//                   label="Last name"
//                   name="lastName"
//                   onChange={handleChange}
//                   type="text"
//                   value={formState.values.lastName || ''}
//                   variant="outlined"
//                 />
//                 <TextField
//                   className={classes.textField}
//                   error={hasError('email')}
//                   fullWidth
//                   helperText={
//                     hasError('email') ? formState.errors.email[0] : null
//                   }
//                   label="Email address"
//                   name="email"
//                   onChange={handleChange}
//                   type="text"
//                   value={formState.values.email || ''}
//                   variant="outlined"
//                 />
//                 <TextField
//                   className={classes.textField}
//                   error={hasError('password')}
//                   fullWidth
//                   helperText={
//                     hasError('password') ? formState.errors.password[0] : null
//                   }
//                   label="Password"
//                   name="password"
//                   onChange={handleChange}
//                   type="password"
//                   value={formState.values.password || ''}
//                   variant="outlined"
//                 />
//                 <div className={classes.policy}>
//                   <Checkbox
//                     checked={formState.values.policy || false}
//                     className={classes.policyCheckbox}
//                     color="primary"
//                     name="policy"
//                     onChange={handleChange}
//                   />
//                   <Typography
//                     className={classes.policyText}
//                     color="textSecondary"
//                     variant="body1">
//                     I have read the{' '}
//                     <Link
//                       color="primary"
//                       component={RouterLink}
//                       to="#"
//                       underline="always"
//                       variant="h6">
//                       Terms and Conditions
//                     </Link>
//                   </Typography>
//                 </div>
//                 {hasError('policy') && (
//                   <FormHelperText error>
//                     {formState.errors.policy[0]}
//                   </FormHelperText>
//                 )}
//                 <Button
//                   className={classes.signUpButton}
//                   color="primary"
//                   disabled={!formState.isValid}
//                   fullWidth
//                   size="large"
//                   type="submit"
//                   variant="contained">
//                   Sign up now
//                 </Button>
//                 <Typography color="textSecondary" variant="body1">
//                   Have an account?{' '}
//                   <Link component={RouterLink} to="/sign-in" variant="h6">
//                     Sign in
//                   </Link>
//                 </Typography>
//               </form>
//             </div>
//           </div>
//         </Grid>
//       </Grid>
//     </div>
//   );
// };

// SignUp.propTypes = {
//   history: PropTypes.object
// };

// export default withRouter(SignUp);
