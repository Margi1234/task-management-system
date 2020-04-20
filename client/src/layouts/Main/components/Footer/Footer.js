import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Typography, Link } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Footer = (props) => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Typography variant="body1">
        &copy; 2020{' '}
        <Link
          component="a"
          href="https://www.accumepartners.com/"
          target="_blank">
          Accume Partners
        </Link>{' '}
        All rights reserved.
      </Typography>
      {/* <Typography variant="caption">
        Created with love for the environment. By designers and developers who
        love to work together in offices!
      </Typography> */}
    </div>
  );
};

Footer.propTypes = {
  className: PropTypes.string
};

export default Footer;
