window.addEventListener('load', async () => {
  const ctx2 = document.getElementById('doughnut').getContext('2d');

  try {
    // Example: Fetch dynamic pet type data (format assumed below)
    const petData = await ajaxRequestHere("/pet/report/pettype-summary");

    // Format assumed: [{type: "Dog", count: 12}, {type: "Cat", count: 19}, ...]
    const labels = petData.map(pet => pet.type);
    const counts = petData.map(pet => pet.count);

    const colors = [
      'rgb(224, 119, 142)',
      'rgb(91, 170, 223)',
      'rgb(196, 173, 120)',
      'rgb(79, 178, 178)',
      'rgb(126, 97, 184)',
      'rgb(179, 137, 96)'
    ];

    const doughnut = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Types of Pets',
          data: counts,
          backgroundColor: colors.slice(0, labels.length), // Slice colors to match data length
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });

  } catch (error) {
    console.error("Failed to load doughnut chart data:", error);
  }
});



/* const ctx = document.getElementById('doughnut').getContext('2d'); */

  /* const doughnut= new Chart(ctx2, {
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
  }); */