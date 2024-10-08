const ctx = document.getElementById('barchart').getContext('2d');

  const barchart= new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        label: 'Number of vaccinations',
        data: [12, 19, 3, 5, 2, 3],
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

  const printChart = ()=>{

    //image source is added to this instance after creating
    viewChart.src = barchart.toBase64Image();
    let newWindow = window.open();

    newWindow.document.write(viewChart.outerHtml + "<script>viewChart.style.removeProperty('display');</script>")

    setTimeout(function (){

      newWindow.print();
      newWindow.close();

    },500)
  }