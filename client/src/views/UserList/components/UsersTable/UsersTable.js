import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Modal from './Modal';
import useModal from './useModal';
import TableSortLabel from '@material-ui/core/TableSortLabel';
// import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  // Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';
// import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
// import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
// import { getInitials } from 'helpers';

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  editBtn: {
    padding: '0',
    minWidth: '24px'
  },
  deleteBtn: {
    padding: '0',
    minWidth: '24px'
  },
  editIcon: {
    color: '#cecece',
    '&:hover': {
      color: 'black'
    }
  },
  deleteIcon: {
    color: '#cecece',
    '&:hover': {
      color: 'black'
    }
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  }
}));
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'name',
    // numeric: false,
    // disablePadding: true,
    label: 'Name'
  },
  {
    id: 'email',
    label: 'Email'
  },
  {
    id: 'type',
    label: 'Type'
  },
  {
    id: 'status',
    label: 'Status'
  },
  {
    id: 'actions',
    label: 'Actions'
  }
];
function EnhancedTableHead(props) {
  const {
    classes,
    // onSelectAllClick,
    order,
    orderBy,
    // numSelected,
    onRequestSort
  } = props;
  const createSortHandler = (property) => (event) => {
    console.log('hi sorting');
    onRequestSort(event, property);
  };
  // const dummyFunction = () => {
  //   console.log('myfunction');
  // };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? 'right' : 'left'}
            // padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              // onClick={dummyFunction}
              onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const UsersTable = (props) => {
  const { className, users, ...rest } = props;
  // const { history } = props;
  const { isShowing, toggle } = useModal();
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  // const [selectedUsers, setSelectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
  };
  const handleDelete = (id) => {
    // event.preventDefault();
    // console.log('email is ', id);
    var i = id;
    var userId = { id: i };
    console.log('userid', userId);
    axios
      .delete('http://localhost:5000/api/users/deleteAdminUser', {
        data: userId
      })
      .then((res) => {
        var stat = res.status;
        if (stat === 200) {
          // history.push('/users');
          window.location.reload();
        }
        console.log(res.status);
      });
    // console.log(key);
  };
  const handleEdit = (id, name, email, status, type) => {
    var userData = {
      id: id,
      name: name,
      email: email,
      status: status,
      type: type
    };
    localStorage.setItem('updateId', userData.id);
    localStorage.setItem('updateEmail', userData.email);
    localStorage.setItem('updateName', userData.name);
    localStorage.setItem('updateType', userData.type);
    localStorage.setItem('updateStatus', userData.status);
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <EnhancedTableHead
                classes={classes}
                // numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                // onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                // rowCount={1}
              />
              {/* <TableHead>
                <TableRow>
                  {/* <TableCell padding="checkbox"> */}
              {/* <Checkbox
                      checked={selectedUsers.length === users.length}
                      color="primary"
                      indeterminate={
                        selectedUsers.length > 0 &&
                        selectedUsers.length < users.length
                      }
                      onChange={handleSelectAll}
                    /> */}
              {/* </TableCell> */}

              {/* </TableRow>
              </TableHead>  */}
              <TableBody>
                {stableSort(users, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow className={classes.tableRow} hover key={user.id}>
                      {/* selected={selectedUsers.indexOf(user.id) !== -1}> */}
                      {/* <TableCell padding="checkbox">   
                      <Checkbox
                        checked={selectedUsers.indexOf(user.id) !== -1}
                        color="primary"
                        onChange={event => handleSelectOne(event, user.id)}
                        value="true"
                      />
                    </TableCell> */}
                      <TableCell>
                        <div className={classes.nameContainer}>
                          {/* <Avatar className={classes.avatar} src={user.avatarUrl}>
                          {getInitials(user.name)}
                        </Avatar> */}
                          <Typography variant="body1">{user.name}</Typography>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      {/* <TableCell>
                      {user.address.city}, {user.address.state},{' '}
                      {user.address.country}
                    </TableCell> */}
                      <TableCell>{user.type}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>
                        <Link to={'users/update'}>
                          <Button
                            onClick={() => {
                              handleEdit(
                                user.id,
                                user.name,
                                user.email,
                                user.status,
                                user.type
                              );
                            }}
                            className={classes.editBtn}>
                            <EditIcon className={classes.editIcon} />{' '}
                          </Button>
                        </Link>
                        <Button
                          // onClick={toggle}
                          onClick={() => {
                            handleDelete(user.id);
                          }}
                          className={classes.deleteBtn}>
                          <Modal isShowing={isShowing} hide={toggle} />
                          <DeleteIcon className={classes.deleteIcon} />
                        </Button>
                      </TableCell>
                      {/* <TableCell>
                      {moment(user.createdAt).format('DD/MM/YYYY')}
                    </TableCell> */}
                    </TableRow>
                  ))}
                {/* <TableRow>{editForm ? 'yes' : 'no'}</TableRow> */}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={users.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
  );
};

UsersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default UsersTable;
// const handleSelectAll = event => {
//   const { users } = props;

//   let selectedUsers;

//   if (event.target.checked) {
//     selectedUsers = users.map(user => user.id);
//   } else {
//     selectedUsers = [];
//   }

//   setSelectedUsers(selectedUsers);
// };

// const handleSelectOne = (event, id) => {
//   const selectedIndex = selectedUsers.indexOf(id);
//   let newSelectedUsers = [];

//   if (selectedIndex === -1) {
//     newSelectedUsers = newSelectedUsers.concat(selectedUsers, id);
//   } else if (selectedIndex === 0) {
//     newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1));
//   } else if (selectedIndex === selectedUsers.length - 1) {
//     newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1));
//   } else if (selectedIndex > 0) {
//     newSelectedUsers = newSelectedUsers.concat(
//       selectedUsers.slice(0, selectedIndex),
//       selectedUsers.slice(selectedIndex + 1)
//     );
//   }

//   setSelectedUsers(newSelectedUsers);
// };
