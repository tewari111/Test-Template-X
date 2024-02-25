import { useState } from 'react';
// import { faker } from '@faker-js/faker';
// import React, {  useState,useEffect, } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import FormView from 'src/sections/overview/form-popover';


// import AppTasks from '../app-tasks';
// import AppNewsUpdate from '../app-news-update';
// import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
// import AppTrafficBySite from '../app-traffic-by-site';
// import AppCurrentSubject from '../app-current-subject';
// import AppConversionRates from '../app-conversion-rates';


// ----------------------------------------------------------------------

export default function AppView() {

  // const [data, setData] = useState();

  // useEffect(()=>{
  //   const fetchData = async ()=>{
  //     const datatFromApi = await fetch('test.com');
  //     const jsonData = await datatFromApi.json();
  //     setData(jsonData);
  //   }
  //   fetchData();
  // },[])

  const [open, setOpen] = useState(false);
  const[formData, setFormData]=useState({
    url:'',
    date:''
  });

  const handleOpen=() => {
  setOpen(true);
      }
  const handleClose=() => {
  setOpen(false);
      }
  
  const handleInputChange=(e) => {
  const {url, value}= e.target;

  setFormData({
      ...formData,
      [url]: value
  });
  }

  const handleSubmit = () => {
    // Handle form submission here, e.g., send data to backend
    console.log(formData);
    handleClose();
  };

  return (
    <Container maxWidth="xl">
      {/* <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography> */}

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpen} >
          Start Org Scan
        </Button>

        <FormView 
        open={open}
        handleClose={handleClose}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        />
      </Stack>

{/* @TODO change the logo */}
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Secrets"
            total={88}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />} 
            />
        </Grid>

{/* @TODO change the logo */}
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Repos"
            total={1352831}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
            />
        </Grid>
{/* @TODO change the logo */}


        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Secrets %"
            total={1723315} // (total repos/totalsecrets)*100
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
          <AppWebsiteVisits
            title="Secrets by Repository"
            // subheader="(+43%) than last year"
            chart={{
              labels: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 90],
              series: [
                {
                  name: 'Repository A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Repository B',
                  type: 'column',
                  fill: 'solid',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Repository C',
                  type: 'column',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ],
            }}
          />
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

        {/* <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Conversion Rates"
            subheader="(+43%) than last year"
            chart={{
              series: [
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ],
            }}
          />
        </Grid> 

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentSubject
            title="Current Subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppNewsUpdate
            title="News Update"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: faker.person.jobTitle(),
              description: faker.commerce.productDescription(),
              image: `/assets/images/covers/cover_${index + 1}.jpg`,
              postedAt: faker.date.recent(),
            }))}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline
            title="Order Timeline"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: [
                '1983, orders, $4220',
                '12 Invoices have been paid',
                'Order #37745 from September',
                'New order placed #XF-2356',
                'New order placed #XF-2346',
              ][index],
              type: `order${index + 1}`,
              time: faker.date.past(),
            }))}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTrafficBySite
            title="Traffic by Site"
            list={[
              {
                name: 'FaceBook',
                value: 323234,
                icon: <Iconify icon="eva:facebook-fill" color="#1877F2" width={32} />,
              },
              {
                name: 'Google',
                value: 341212,
                icon: <Iconify icon="eva:google-fill" color="#DF3E30" width={32} />,
              },
              {
                name: 'Linkedin',
                value: 411213,
                icon: <Iconify icon="eva:linkedin-fill" color="#006097" width={32} />,
              },
              {
                name: 'Twitter',
                value: 443232,
                icon: <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={32} />,
              },
            ]}
          />
          </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}>
          <AppTasks
            title="Tasks"
            list={[
              { id: '1', name: 'Create FireStone Logo' },
              { id: '2', name: 'Add SCSS and JS files if required' },
              { id: '3', name: 'Stakeholder Meeting' },
              { id: '4', name: 'Scoping & Estimations' },
              { id: '5', name: 'Sprint Showcase' },
            ]}
          />
        </Grid> */}
      </Grid>
    </Container>
  );
}


