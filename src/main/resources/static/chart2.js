const ctx = document.getElementById('doughnut').getContext('2d');

  const doughnut= new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: ['Dog', 'Cat', 'Rabbit'],
      datasets: [{
        label: 'Types of Pets',
        data: [12, 19, 3],
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });