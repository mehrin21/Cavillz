

console.log("Axios is loaded")
axios.get('/admin/chartData')
  .then((response)=>{
     console.log(response.data);
    /*Sale statistics Chart*/
    if ($('#myChart').length) {
        // console.log("here the chart")
        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
            
            // The data for our dataset
            data: {
                labels:response.data.date,
                datasets : [{
                        label: 'Sales',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(44, 120, 220, 0.2)',
                        borderColor: 'rgba(44, 120, 220)',
                        data: response.data.data
                    },
                  
                ]
            },
            options: {
                plugins: {
                legend: {
                    labels: {
                    usePointStyle: true,
                    },
                }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
 }) 
 .catch(error =>{
    console.log(error.message)
 })//End if
 axios.get('/admin/chartData2')
 .then((response) => {
     console.log(response.data);
     if ($('#myChart2').length) {
         const months = {
             '01': 'January',
             '02': 'February',
             '03': 'March',
             '04': 'April',
             '05': 'May',
             '06': 'June',
             '07': 'July',
             '08': 'August',
             '09': 'September',
             '10': 'October',
             '11': 'November',
             '12': 'December',
         };

         const labels = response.data.date.map(date => {
             const [year, month] = date.split('-');
             return months[month] + ' ' + year;
         });

         let ctx = document.getElementById("myChart2");
         var myChart = new Chart(ctx, {
             type: 'bar',
             data: {
                 labels: labels,
                 datasets: [
                     {
                         label: 'Sales',
                         tension: 0.3,
                         fill: true,
                         backgroundColor: 'rgba(44, 120, 220, 0.2)',
                         borderColor: 'rgba(44, 120, 220)',
                         data: response.data.data
                     },
                 ]
             },
             options: {
                 plugins: {
                     legend: {
                         labels: {
                             usePointStyle: true,
                         },
                     }
                 },
                 scales: {
                     y: {
                         beginAtZero: true
                     }
                 }
             }
         });
     }
    }) 
    .catch(error =>{
       console.log(error.message)
    })