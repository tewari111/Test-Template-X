import { useState, useEffect } from 'react';

// import Card from '@mui/material/Card';
// import { Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

// import { users } from 'src/_mock/user';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// import FormView from '../form-popover';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [open, setOpen] = useState(false);
  // const [formData, setFormData] = useState({
  //   url: '',
  //   date: '',
  // });

  const [scanData, setScanData] = useState([]);
  const [totalRepos, setTotalRepos] = useState([]);

  useEffect(() => {
    fetchTotlaRepos();
    fetchScanData();
  }, []);

  // console.log(responseData);
  console.log(scanData);

  const fetchScanData = async () => {
    try {
      const response = await fetch('http://65.1.132.241:8000/getOrgScan');
      const data = await response.json();
      setScanData(data.repositories);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTotlaRepos = async () => {
    try {
      const response = await fetch('http://65.1.132.241:8000/settings');
      const data = await response.json();
      setTotalRepos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchScanOrg = async () => {
    try {
      await fetch('http://65.1.132.241:8000/scanOrg');
    } catch (error) {
      console.error(error);
    }
  };

  const totalReposPercent = (scanData.length / totalRepos.totalRepos) * 100 || 0;

  // const handleInputChange = (e) => {
  //   const { url, value } = e.target;

  //   setFormData({
  //     ...formData,
  //     [url]: value,
  //   });
  // };

  // const handleSubmit = () => {
  //   // Handle form submission here, e.g., send data to backend
  //   console.log(formData);
  //   handleClose();
  // };

  const handleOpen = () => {
    fetchScanOrg();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // const handleInputChange = (e) => {
  //   const { url, value } = e.target;

  //   setFormData({
  //     ...formData,
  //     [url]: value,
  //   });
  // };

  // const handleSubmit = () => {
  //   // Handle form submission here, e.g., send data to backend
  //   console.log(formData);
  //   handleClose();
  // };

  const handleSort = (event, id) => {
    console.log(orderBy, id, order);
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  // Users data used here, change with api call data
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = scanData.map((n) => n.repository);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  // users data change with api data
  const dataFiltered = applyFilter({
    inputData: scanData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  console.log(order, orderBy);

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between" mb={6}>
        <Typography variant="h4">Repositories</Typography>

        <Dialog open={!!open} onClose={handleClose}>
          <DialogTitle>Start ScanOrg for fethc api</DialogTitle>
          <DialogContent>
            <Typography variant="body1">Started!</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <div>
          <Button variant="contained" sx={{ mr: 1 }}>
            {totalReposPercent}%
          </Button>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpen}
          >
            Start Org Scan
          </Button>
        </div>
      </Stack>

      {/* <Card> */}
      <UserTableToolbar
        numSelected={selected.length}
        filterName={filterName}
        onFilterName={handleFilterByName}
      />

      <Scrollbar>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            {/* // users data */}
            <UserTableHead
              order={order}
              orderBy={orderBy}
              rowCount={scanData.length}
              numSelected={selected.length}
              onRequestSort={handleSort}
              onSelectAllClick={handleSelectAllClick}
              headLabel={[
                { id: 'name', label: 'Repository Name' },
                { id: 'secrets', label: 'Total Secrets' },
                { id: 'show', label: 'Show Secrets' },
                { id: 'commits', label: 'Total Commits' },
                // { id: 'isVerified', label: 'Verified', align: 'center' },
                // { id: '' },
              ]}
            />
            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => (
                  <UserTableRow
                    key={i}
                    id={i}
                    name={row.repository}
                    show="Show secrets"
                    status={i}
                    secrets={row.secrets.length}
                    // avatarUrl={row.avatarUrl}
                    commits={row.totalNoCommits}
                    selected={selected.indexOf(row.repository) !== -1}
                    handleClick={(event) => handleClick(event, row.repository)}
                  />
                ))}
              {/* user data */}
              <TableEmptyRows
                height={77}
                emptyRows={emptyRows(page, rowsPerPage, scanData.length)}
              />

              {notFound && <TableNoData query={filterName} />}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        page={page}
        component="div"
        count={scanData.length}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {/* </Card> */}
    </Container>
  );
}
