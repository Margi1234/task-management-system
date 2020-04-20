import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button, Typography } from '@material-ui/core';
import auth from '../../common/auth';
const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
    backgroundImage:
      'url("https://www.accumepartners.com/wp-content/uploads/2018/07/front-banner.jpg")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    position: 'relative'
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '0',
    left: '0',
    backgroundColor: 'rgba(14,70,129,0.5)',
    height: '100%',
    width: '100%'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  signIpButton: {
    margin: theme.spacing(2, 0),
    color: theme.palette.white,
    padding: '5px 20px',
    border: 'solid 2px white',
    borderRadius: '20px',
    '&:hover': {
      backgroundColor: theme.palette.white,
      color: theme.palette.primary.dark,
      transition: '0.4s'
    }
  }
});

class AccountCreated extends Component {
  componentDidMount() {
    if (!auth.isRegistered()) {
      this.props.history.push('/sign-up');
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid className={classes.grid} container>
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography className={classes.quoteText} variant="h1">
                You have successfully registered your account.{' '}
              </Typography>
            </div>
            <RouterLink to="/sign-in">
              {' '}
              <Button className={classes.signIpButton}>Sign in</Button>
            </RouterLink>
          </div>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(AccountCreated);
