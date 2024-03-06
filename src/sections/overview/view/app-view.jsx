import { useState, useEffect } from 'react';
// import { faker } from '@faker-js/faker';
// import React, {  useState,useEffect, } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';
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
  // const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [scanData, setScanData] = useState([]);
  const [totalRepos, setTotalRepos] = useState([]);
  const [getStorageData, setGetStorageData] = useState([]);

  useEffect(() => {
    fetchTotlaRepos();
    fetchScanData();

    const storedData = JSON.parse(localStorage.getItem('postRequestMessages'));
    if (storedData) {
      setGetStorageData(storedData);
    }
  }, []);

  // console.log(responseData);
  // console.log(scanData);
  // console.log(getStorageData);

  const fetchScanData = async () => {
    try {
      const response = await fetch('http://65.1.132.241:8000/getOrgScan');
      const jsonData = await response.json();
      setScanData(jsonData.repositories);
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
      const jsonData = await response.json();
      setTotalRepos(jsonData);
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

  const pieChartData = scanData.map((item, index) => ({
    label: item.repository,
    value: (item.secrets.length / totalSecrets) * 100,
  }));

  // console.log('pie chart', pieChartData);

  // const data = [4000, 3000, 2000, null, 1890, 2390, 3490];
  // const xData = ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'];

  const yData = [];
  const dates = getStorageData.map((item, i) => {
    const dateString = item.split('Org scan started!: ')[1]; // Extract the portion after the colon and space
    const date = dateString;
    if (i === 0) {
      yData.push(i);
    } else {
      yData.push(secretRatio);
    }

    return date;
  });

  const data = yData;
  const xData = dates;

  console.log(dates);
  const handleOpen = async () => {
    fetchScanOrg();
    setOpen(true);
    const currentTime = new Date().toLocaleTimeString();
    const currentDate = new Date().toLocaleDateString();
    const newMessageEntry = `Org scan started!: ${currentDate} ${currentTime}`;

    // Retrieve the existing messages array from localStorage
    const storedMessages = localStorage.getItem('postRequestMessages');
    const messages = storedMessages ? JSON.parse(storedMessages) : [];

    const updatedMessages = [...messages, newMessageEntry];
    localStorage.setItem('postRequestMessages', JSON.stringify(updatedMessages));
    try {
      await fetch('http://65.1.132.241:8000/scanOrg');
    } catch (error) {
      console.error(error);
    }
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
        <Grid xs={12} md={6} lg={8} mt={1.5} bgcolor="white" borderRadius="15px" height="78vh">
          <LineChart
            xAxis={[{ data: xData, scaleType: 'point' }]}
            series={[{ data, connectNulls: true }]}
            height={350}
            margin={{ top: 30, bottom: 20 }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Repos Ratio"
            chart={{
              series: pieChartData,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
