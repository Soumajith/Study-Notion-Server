import React, { useState, useEffect, useRef } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Chart from 'chart.js/auto';

const AdminStatistics = () => {
  const [userData, setUserData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const statsRef = useRef();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://dashboard-server-7t1v.onrender.com/client/customers');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchRevenueData = async () => {
      try {
        const response = await axios.get('https://dashboard-server-7t1v.onrender.com/sales/sales');
        setRevenueData(response.data);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchUserData();
    fetchRevenueData();
    setLoading(false);
  }, []);

  const downloadPage = async () => {
    const canvas = await html2canvas(statsRef.current);
    canvas.toBlob((blob) => {
      saveAs(blob, 'statistics.png');
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Example data structure for the user growth chart
  const usersChartData = {
    labels: userData?.map(user => new Date(user.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Number of Users',
        data: userData?.map((_, index) => index + 1),
        fill: false,
        backgroundColor: 'blue',
        borderColor: 'blue',
      },
    ],
  };

  const revenueChartData = {
    labels: revenueData.monthlyData?.map(month => month.month),
    datasets: [
      {
        label: 'Total Sales',
        data: revenueData.monthlyData?.map(month => month.totalSales),
        fill: false,
        backgroundColor: 'green',
        borderColor: 'green',
      },
    ],
  };

  // Data structure for year-wise users pie chart
  const yearWiseUserData = userData.reduce((acc, user) => {
    const year = new Date(user.createdAt).getFullYear();
    if (acc[year]) {
      acc[year]++;
    } else {
      acc[year] = 1;
    }
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(yearWiseUserData),
    datasets: [
      {
        data: Object.values(yearWiseUserData),
        backgroundColor: ['red', 'blue', 'yellow', 'green', 'purple', 'orange'],
      },
    ],
  };

  return (
    <div ref={statsRef} style={{ backgroundColor: 'black', padding: '20px' }}>
      <h2 className='text-white text-3xl font-bold'>Admin Statistics</h2>
      <div style={{ width: '600px', margin: '0 auto', marginBottom: '20px' }}>
        <h3 className='text-white text-xl font-semibold'>User Growth</h3>
        <p  className='text-pure-greys-50'>This chart shows the growth in the number of users over time.</p>
        <div id="userChart" style={{ width: '100%', height: '300px', marginBottom: '20px' }}>
          <Line data={usersChartData} />
        </div>
      </div>
      <div style={{ width: '600px', margin: '0 auto', marginBottom: '20px' }}>
        <h3  className='text-white text-xl font-semibold'>Revenue Growth</h3>
        <p  className='text-pure-greys-50'>This chart displays the total sales revenue on a monthly basis.</p>
        <div id="revenueChart" style={{ width: '100%', height: '300px', marginBottom: '20px' }}>
          <Line data={revenueChartData} />
        </div>
      </div>
      <div style={{ width: '600px', margin: '0 auto', marginBottom: '20px' }}>
        <h3  className='text-white text-xl font-semibold'>Year-wise User Distribution</h3>
        <p   className='text-pure-greys-50'>This pie chart illustrates the distribution of users based on the year they joined.</p>
        <div id="pieChart" style={{ width: '100%', height: '300px', marginBottom: '20px' }}>
          <Pie data={pieChartData} />
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={downloadPage}  className='px-3 py-2 font-semibold rounded-sm text-black bg-yellow-100'>Download Statistics</button>
      </div>
    </div>
  );
};

export default AdminStatistics;
