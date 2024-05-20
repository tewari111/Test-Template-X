// import { debounce } from 'lodash';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
// import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import {
  Box,
  Grid,
  Button,
  Pagination,
  Typography,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import ErrorPage from 'src/sections/error/ErrorPage';

import ScanOrg from './ScanOrg';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import UserTableToolbar from '../user-table-toolbar';

// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState(false);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [errors, setErrors] = useState(null);
  const [orderBy, setOrderBy] = useState('name');
  const [keyword, setKeyword] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [scanData, setScanData] = useState([]);
  // const [totalRepos, setTotalRepos] = useState([]);
  // const [messages, setMessages] = useState([]);

  const startIndex = page * rowsPerPage;
  const endIndex = (page + 1) * rowsPerPage;
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchScanData = async () => {
      try {
        const response = await fetch(
          `${process.env.getOrgScan}?start_index=${startIndex}&end_index=${endIndex}&keyword=${keyword}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
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
  }, [page, rowsPerPage, startIndex, endIndex, accessToken, keyword]);

  // const totalReposPercent = (scanData.length / totalRepos.totalRepos) * 100 || 0;

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

  const handleSearch = async () => {
    setLoading(true);
    const url = `${process.env.getOrgScan}?start_index=${startIndex}&end_index=${endIndex}&sort=${sort}&keyword=${keyword}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setScanData(data.repositories);
      }
    } catch (error) {
      setErrors('Failed to fetch scan data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const check = Boolean(e.target.value);
    if (check) {
      setScanData(scanData);
    }
    setKeyword(e.target.value);
  };
  // const handleSearchDebounced = debounce(handleSearch, 2000);
  // console.log('sort..........', sort);
  // users data change with api data
  useEffect(() => {
    if (keyword.length === 0) {
      setScanData(scanData);
    }
  }, [keyword, scanData]);
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
          <ScanOrg />
        </Grid>
      </Stack>

      <Box
        sx={{
          display: 'flex',
          height: '100px',
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Grid display="flex" alignItems="center">
          <OutlinedInput
            placeholder="Search and sort feature..."
            onChange={handleSearchChange}
            sx={{ width: '100%' }}
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: 'text.disabled', width: 30, height: 20 }}
                />
              </InputAdornment>
            }
          />
          <Button
            type="submit"
            onClick={handleSearch}
            variant="contained"
            sx={{ ml: 1, bgcolor: '#DDDDDD', height: '50px', ':hover': { bgcolor: '#EEEEEE' } }}
          >
            {' '}
            <Iconify
              icon="eva:search-fill"
              sx={{ color: 'text.disabled', width: 40, height: 25 }}
            />
          </Button>
        </Grid>
        <UserTableToolbar
          numSelected={selected.length}
          onKeyUp={handleSearch}
          selected={selected}
        />
      </Box>
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
                {scanData.map((row, i) => (
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
            color="primary"
          />
        </TableContainer>
      </Scrollbar>

      {/* </Card> */}
    </Container>
  );
}
