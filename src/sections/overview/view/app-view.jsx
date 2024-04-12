import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';
import CircularProgress from '@mui/material/CircularProgress';

import ScanOrg from 'src/sections/user/view/ScanOrg';

import AppCurrentVisits from '../app-current-visits';
import AppWidgetSummary from '../app-widget-summary';

export default function AppView() {
  const [dashData, setDashData] = useState([]);
  const [dateAndTime, setDateAndeTime] = useState([]);
  const [dataLength, setDataLength] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.baseUrl}/getDash?start_index=0&end_index=10`);

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
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {}, [dataLength]);

  useEffect(() => {
    const newDataLength = dashData.map((item) => Object.keys(item.data).length);
    setDataLength(newDataLength.reverse());
  }, [dashData]);

  console.log('dataLength', dataLength);

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
  const totalReposPercent = (totalRepo / totalRepo) * 100;

  const pieChartData = [];
  Object.entries(totalS).map(([key, value]) =>
    pieChartData.push({ label: key, value: Math.ceil((value / totalSecrets) * 100) })
  );

  const dividedArray = dataLength.map((value) => totalSecrets / value);

  console.log('dividedArray.......', dividedArray);
  console.log('xDATa............', dateAndTime);
  const newArr = [];

  for (let i = 0; i < dateAndTime.length; ) {
    const year = parseInt(dateAndTime[i].substr(0, 4), 10);
    const month = parseInt(dateAndTime[i].substr(4, 2), 10);
    const day = parseInt(dateAndTime[i].substr(6, 2), 10);
    const hours = parseInt(dateAndTime[i].substr(9, 2), 10);
    const minutes = parseInt(dateAndTime[i].substr(11, 2), 10);
    const seconds = parseInt(dateAndTime[i].substr(13, 2), 10);
    const dateTimeObject = new Date(year, month, day, hours, minutes, seconds);
    newArr.push(dateTimeObject);
    i += 1;
  }

  console.log('new Arr', newArr);

  const data = dividedArray;
  // const xData = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const xData = dateAndTime;

  return (
    <Container maxWidth="xl">
      {/* <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography> */}

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back 👋
        </Typography>
        <Grid display="flex">
          <Button variant="contained" sx={{ mr: 1 }}>
            {totalReposPercent.toFixed(0)}%
          </Button>
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
      )}
    </Container>
  );
}
