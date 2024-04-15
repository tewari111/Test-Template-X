import { useState, useEffect } from 'react';

// import Card from '@mui/material/Card';
// import { Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import { Grid, Pagination } from '@mui/material';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
// import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

// import { users } from 'src/_mock/user';
import Scrollbar from 'src/components/scrollbar';

import ErrorPage from 'src/sections/error/ErrorPage';

import ScanOrg from './ScanOrg';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import UserTableToolbar from '../user-table-toolbar';
import { applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState(false);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [errors, setErrors] = useState(null);
  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  // const [formData, setFormData] = useState({
  //   url: '',
  //   date: '',y
  // });

  const [scanData, setScanData] = useState([]);
  const [totalRepos, setTotalRepos] = useState([]);
  // const [messages, setMessages] = useState([]);

  const startIndex = page * rowsPerPage;
  const endIndex = (page + 1) * rowsPerPage;
  console.log('startIndex.........', startIndex);
  console.log('endIndex.........', endIndex);

  useEffect(() => {
    const fetchScanData = async () => {
      try {
        const response = await fetch(
          `${process.env.getOrgScan}?start_index=${startIndex}&end_index=${endIndex}`
        );
        if (response.ok) {
          const data = await response.json();
          setTotalPages(data.totalPages);
          setScanData(data.repositories);
        }
      } catch (error) {
        setErrors('Failed to fetch scan data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchScanData();
    fetchTotlaRepos();
  }, [page, rowsPerPage, startIndex, endIndex]);

  const fetchTotlaRepos = async () => {
    try {
      const response = await fetch(process.env.settings);
      if (response.ok) {
        const data = await response.json();
        setTotalRepos(data);
      }
    } catch (error) {
      setErrors('Failed to fetch totalRepos data. Please try again later.');
    }
  };

  const totalReposPercent = (scanData.length / totalRepos.totalRepos) * 100 || 0;

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const sortDataAsc = () => {
    const sortedData = [...scanData].sort((a, b) => a.repository.localeCompare(b.repository));
    setScanData(sortedData);
  };

  const sortDataDesc = () => {
    const sortedData = [...scanData].sort((a, b) => b.repository.localeCompare(a.repository));
    setScanData(sortedData);
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
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleSearch = async (keyword) => {
    const url = `${process.env.getOrgScan}?start_index=${startIndex}&end_index=${endIndex}&sort=${sort}&keyword=${filterName}`;
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response;
      })
      .then((data) => {
        setErrors('Failed to fetch scan data. Please try again later.');
      })
      .catch((error) => setErrors(error.message));
  };

  console.log('sort..........', sort);
  // users data change with api data
  const dataFiltered = applyFilter({
    inputData: scanData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  if (sort) {
    scanData.sort((a, b) => b.secrets.length - a.secrets.length);
  } else {
    scanData.sort((a, b) => a.secrets.length - b.secrets.length);
  }

  if (errors) {
    return <ErrorPage errorMessage={errors} />;
  }
  return (
    <Container>
      <Stack direction="row" justifyContent="space-between" mb={6}>
        <Typography variant="h4">Repositories</Typography>

        <Grid display="flex">
          <Button variant="contained" sx={{ mr: 1 }}>
            {totalReposPercent.toFixed(0)}%
          </Button>
          <ScanOrg />
        </Grid>
      </Stack>

      {/* <Card> */}
      <UserTableToolbar
        numSelected={selected.length}
        filterName={filterName}
        onFilterName={handleFilterByName}
        onKeyUp={handleSearch}
        selected={selected}
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
              onAscSort={sortDataAsc}
              onDescSort={sortDataDesc}
              sort={sort}
              setSort={setSort}
              headLabel={[
                { id: 'name', label: 'Repository Name', sortable: true },
                { id: 'secrets', label: 'Total Secrets' },
                { id: 'show', label: 'Show Secrets' },
                { id: 'commits', label: 'Total Commits' },
                { id: 'isVerified', label: 'Verified', align: 'center' },
                // { id: '' },
              ]}
            />
            {loading ? (
              <Grid sx={{ position: 'relative', left: '400%', top: '20px', padding: '30px' }}>
                <CircularProgress />
              </Grid>
            ) : (
              <TableBody>
                {dataFiltered.map((row, i) => (
                  <UserTableRow
                    key={i}
                    id={i}
                    name={row.repository}
                    show="Show secrets"
                    startIndex={startIndex}
                    endIndex={endIndex}
                    status={i}
                    secrets={row.secrets.length}
                    // avatarUrl={row.avatarUrl}
                    commits={row.totalNoCommits}
                    selected={selected.indexOf(row.repository) !== -1}
                    handleClick={(event) => handleClick(event, row.repository)}
                  />
                ))}

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            )}
          </Table>
          <Pagination
            sx={{ mt: 2 }}
            page={page + 1}
            count={totalPages}
            rowsPerPage={rowsPerPage}
            onChange={(event, newPage) => handleChangePage(event, newPage - 1)}
            onRowsPerPageChange={(event) => handleChangeRowsPerPage(event.target.value)}
          />
        </TableContainer>
      </Scrollbar>

      {/* </Card> */}
    </Container>
  );
}
