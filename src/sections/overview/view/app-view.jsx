import { useState, useEffect } from 'react';
// import { faker } from '@faker-js/faker';
// import React, {  useState,useEffect, } from 'react';

import { Line, XAxis, YAxis, Legend, Tooltip, LineChart, CartesianGrid } from 'recharts';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import Iconify from 'src/components/iconify';

// import FormView from 'src/sections/overview/form-popover';

// import AppTasks from '../app-tasks';
// import AppNewsUpdate from '../app-news-update';
// import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
// import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
// import AppTrafficBySite from '../app-traffic-by-site';
// import AppCurrentSubject from '../app-current-subject';
// import AppConversionRates from '../app-conversion-rates';

// ----------------------------------------------------------------------

export default function AppView() {
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

  const fetchScanOrg = async () => {
    try {
      await fetch('http://65.1.132.241:8000/scanOrg');
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

  let totalSecrets = 0;
  try {
    scanData.forEach((repo) => {
      totalSecrets += repo.secrets.length;
    });
  } catch (error) {
    console.error(error);
  }

  const secretRatio = totalSecrets / totalRepos.totalRepos;

  const totalReposPercent = (totalRepos.totalRepos / totalRepos.totalRepos) * 100 || 0;

  // const pieChartData = data.map((item, index) => ({
  //   label: item.repository,
  //   value: ((item.secrets + 1) / totalSecrets) * 100,
  // }));

  // const series = scanData.map((repos)=>({
  //   lable: repos.secrets.length + 1,
  //   value: totalSecrets
  // }))
  const [open, setOpen] = useState(false);
  // const [formData, setFormData] = useState({
  //   url: '',
  //   date: '',
  // });

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

  return (
    <Container maxWidth="xl">
      {/* <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography> */}

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back 👋
        </Typography>

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

      {/* @TODO change the logo */}
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Secrets"
            total={totalSecrets}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        {/* @TODO change the logo */}
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Repos"
            total={scanData.length}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>
        {/* @TODO change the logo */}

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Secrets ratio/repo"
            total={secretRatio || '0'} // (total repos/totalsecrets)*100
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>
        {/* @TODO change the logo */}

        {/* <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Repo_3_name"
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid> */}
        {/* @TODO change the logo */}
        <Grid xs={12} md={6} lg={8}>
          <LineChart width={500} height={400} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="secrets" label="Secretes" />
            <YAxis dataKey="repos" label="" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="repos" stroke="#8884d8" />
          </LineChart>
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Disclosed Secrets"
            chart={{
              series: [
                { label: 'Repo1', value: 4344 },
                { label: 'Repo2', value: 5343 },
                { label: 'Repo3', value: 1443 },
                { label: 'Repo4', value: 4443 },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
