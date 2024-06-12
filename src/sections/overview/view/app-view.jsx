import { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';
import CircularProgress from '@mui/material/CircularProgress';

import AwsLogin from 'src/AwsLogin';

import ScanOrg from 'src/sections/user/view/ScanOrg';
import ErrorPage from 'src/sections/error/ErrorPage';

import AppWidgetSummary from '../app-widget-summary';

export const options = {
  title: 'Repos Ratio',
  pieHole: 0.4,
  is3D: false,
};

export default function AppView() {
  const [dashData, setDashData] = useState([]);
  const [dateAndTime, setDateAndeTime] = useState([]);
  const [dataLength, setDataLength] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const accessToken = localStorage.getItem('accessToken');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.baseUrl}/getDash?start_index=0&end_index=10`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setDashData(data.data);
          setDateAndeTime(
            data.data.map(
              (item) =>
                `${item.collection_name.slice(0, 4)}/${item.collection_name.slice(
                  4,
                  6
                )}/${item.collection_name.slice(6, 8)} ${item.collection_name.slice(
                  9,
                  11
                )}:${item.collection_name.slice(11, 13)}:${item.collection_name.slice(13)}`
            )
          );
        }
      } catch (error) {
        setErrors('Failed to fetch dash data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  useEffect(() => {}, [dataLength]);

  useEffect(() => {
    const newDataLength = dashData.map((item) => Object.keys(item.data).length);
    setDataLength(newDataLength.reverse());
  }, [dashData]);

  let totalSecrets = 0;
  const totalRepos = [];

  let totalS = [];
  if (dashData.length) {
    totalS = dashData[0].data;
    Object.entries(totalS).forEach(([key, value]) => {
      totalRepos.push(value); // finding totalRepos
      totalSecrets += value;
    });
  }

  const totalRepo = totalRepos.length;
  const secretRatio = totalSecrets / totalRepo;
  // const totalReposPercent = (totalRepo / totalRepo) * 100;

  const pieChartData1 = [['Task', 'Hours per Day']];

  if (dashData.length) {
    totalS = dashData[0].data;
    Object.entries(totalS).forEach(([key, value]) => {
      pieChartData1.push([`${key}`, Math.ceil((value / totalSecrets) * 100)]);
    });
  }

  const dataOfYaxis = dataLength.map((value) => (totalSecrets / value).toFixed(2));
  const convertedArray = dateAndTime.map((dateTime) => {
    const [date, time] = dateTime.split(' ');
    const [year, month, day] = date.split('/').map((part) => parseInt(part, 10));
    const [hours, minutes, seconds] = time.split(':').map((part) => parseInt(part, 10));
    const full = `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(
      2,
      '0'
    )} ${hours}:${minutes}:${seconds}`;
    return [full];
  });

  // const xData = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const data = dataOfYaxis.reverse();
  const xData = convertedArray; // Date And Time data

  // Get the token from localStorage
  const token = localStorage.getItem('accessToken');

  // Split the token into sections
  let sections;
  if (token) {
    sections = token.split('.');
  }
  // Log the third section

  // Decode the third section
  try {
    const decodedSection = atob(sections[1]);

    // Parse the decoded section as JSON
    const decodedData = JSON.parse(decodedSection);

    // Extract the username using object destructuring
    const { username, email } = decodedData;

    // Save the username in localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
  } catch (error) {
    <ErrorPage errorMessage="Field to decode token" />;
  }

  if (errors) {
    return <ErrorPage errorMessage={errors} />;
  }

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back 👋
        </Typography>
        <Grid display="flex">
          <AwsLogin />
          <ScanOrg />
        </Grid>
      </Stack>

      {/* @TODO change the logo */}
      {loading ? (
        <Grid container justifyContent="center" mt={10} mr={5}>
          <CircularProgress />
        </Grid>
      ) : (
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
              total={totalRepos.length}
              color="info"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
            />
          </Grid>
          {/* @TODO change the logo */}

          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Secrets ratio/repo"
              total={secretRatio} // (total repos/totalsecrets)*100
              color="warning"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
            />
          </Grid>
          <Grid xs={12} md={12} lg={12} mt={1.5} bgcolor="white" borderRadius="15px" height="78vh">
            <LineChart
              xAxis={[{ data: xData, scaleType: 'point' }]}
              series={[{ data, connectNulls: true }]}
              height={350}
              margin={{ top: 30, bottom: 20 }}
            />
          </Grid>
          {/*
          <Grid xs={12} md={6} lg={5}>
            <AppCurrentVisits
              title="Repos Ratio"
              chart={{
                series: pieChartData,
              }}
            />
          </Grid>
          */}

          <Grid xs={12} md={12} lg={12} mt={1.5} bgcolor="white" borderRadius="15px" height="78vh">
            <Chart
              chartType="PieChart"
              width="100%"
              height="480px"
              data={pieChartData1}
              options={{
                title: 'Repos Ratio',
                pieHole: 0.4,
                is3D: false,
              }}
            />
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
