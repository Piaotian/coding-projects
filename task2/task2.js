let filteredData = data;
let group = 'cohort';
let sites;
let today = new Date();
const chartData = {};
const startDateInput = document.querySelector('#startDate');
const endDateInput = document.querySelector('#endDate');

// Set end date input can't earlier than start date input
startDateInput.addEventListener('change', (e) => {
  endDateInput.min = e.target.value;
});

// Set start date input can't later than end date input
endDateInput.addEventListener('change', (e) => {
  startDateInput.max = e.target.value;
});

// Initialize data
function initializeData() {
  const siteSet = new Set();
  // Create array of sites
  // Change date of consent string to Date object
  // Calculate age and add to data
  data.forEach((record) => {
    siteSet.add(record['site ID']);
    record['date of consent'] = new Date(record['date of consent']);
    record['age'] = calculateAge(record['birth date']);
  });
  sites = Array.from(siteSet);
  sites.forEach((site) => {
    chartData[site] = {};
  });
}

// Calculate age based on birth date and today's date
function calculateAge(dateString) {
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Handle group change
function handleGroup(value) {
  if (value === 'cohort') {
    group = 'cohort';
    handleCohortGroup();
  } else if (value === 'age') {
    group = 'age';
    handleAgeGroup();
  }
  generateChart();
}

// Generate chartData when cohort is selected as group
function handleCohortGroup() {
  for (const site in chartData) {
    chartData[site] = {
      CHR: 0,
      HC: 0,
    };
  }
  filteredData.forEach((item) => {
    if (item.cohort === 'CHR') {
      chartData[item['site ID']]['CHR'] += 1;
    } else if (item.cohort === 'HC') {
      chartData[item['site ID']]['HC'] += 1;
    }
  });
}

// Generate chartData when age is selected as group
function handleAgeGroup() {
  for (const site in chartData) {
    chartData[site] = {
      '< 20': 0,
      '20-29': 0,
      '30-39': 0,
      '40-49': 0,
      '50-59': 0,
      '60+': 0,
    };
  }
  filteredData.forEach((item) => {
    if (item.age < 20) {
      chartData[item['site ID']]['< 20'] += 1;
    } else if (item.age < 30) {
      chartData[item['site ID']]['20-29'] += 1;
    } else if (item.age < 40) {
      chartData[item['site ID']]['30-39'] += 1;
    } else if (item.age < 50) {
      chartData[item['site ID']]['40-49'] += 1;
    } else if (item.age < 60) {
      chartData[item['site ID']]['50-59'] += 1;
    } else {
      chartData[item['site ID']]['60+'] += 1;
    }
  });
}

// Filter data based on date of consent by the time period from user input
function handleFilter() {
  const startDate = new Date(startDateInput.value.replace(/-/g, '/'));
  const endDate = new Date(endDateInput.value.replace(/-/g, '/'));
  filteredData = data.filter(
    (item) =>
      !(item['date of consent'] < startDate) &&
      !(item['date of consent'] > endDate)
  );
  handleGroup(group);
}

// Format chartData so that can be used to draw chart
function formatChartData() {
  const groups = Object.keys(chartData[sites[0]]);
  const seriesData = [];

  groups.forEach((group) => {
    const data = [];
    sites.forEach((site) => {
      data.push(chartData[site][group]);
    });
    seriesData.push({ name: group, data });
  });
  return seriesData;
}

// Generate barchart using Highcharts
function generateChart() {
  const data = formatChartData();
  Highcharts.chart('chart', {
    chart: {
      type: 'column',
    },
    title: {
      text: undefined,
    },
    xAxis: {
      categories: sites,
    },
    yAxis: {
      title: {
        text: 'Enrollment',
      },
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          formatter: function () {
            if (this.y != 0) {
              return Math.round((100 * this.y) / this.total) + '%';
            } else {
              return null;
            }
          },
        },
      },
    },
    series: data,
  });
}

// Run when the page first load
initializeData();
handleGroup('cohort');
generateChart();
