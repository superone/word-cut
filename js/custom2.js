$(document).ready(function() {
$('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

    $('#top-toolbar').hide();
    $(window).scroll(function() {
        var height = $(window).scrollTop();
        if (height > 168) {
            $('#top-toolbar').show();
        } else if (height < 167) {
            $('#top-toolbar').hide();
        }
    });

    $('#back').click(function() {
        window.location.href = "instrument.html";
    });

    var ctx = $("#myChart");
    var data = {
        labels: ["FamCA", "APT", "SASC", "VSC", "AATA", "NSWSC", "SASC"],
        datasets: [{
            label: "Court",
            backgroundColor: ["#1776d2", "#80deea", "#66b86a", "#00887a", "#d4e157", "#5e35b0", "#90a4ae"],
            data: [45, 24, 12, 11, 6, 4, 3]
        }]
    }
    var options = {
        title: {
            display: false,
            text: 'Case activity by court'
        },
        legend: {
            position: 'top',
            label: {
                boxWidth: 20
            },
            display: false
        },
        cutoutPercentage: 84,
        responsive: false,
        padding: {
            top: 12,
            left: 12,
            right: 12,
            left: 12
        }
    }

    var options2 = {
        title: {
            display: false,

        },
        legend: {

            display: false
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                gridLines: {
                    display: false
                },
                barPercentage: 0.8
            }],
            yAxes: [{
                ticks: {
                    stepSize: 15
                },

            }]
        },
    }
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });

    document.getElementById('js-legend').innerHTML = myChart.generateLegend();

    var ctx2 = $("#myBar");
    var data2 = {
        labels: ["FamCA", "APT", "SASC", "VSC", "AATA", "NSWSC", "SASC"],
        datasets: [{
            label: "Court",
            backgroundColor: ["#1976d2", "#1976d2", "#1976d2", "#1976d2", "#1976d2", "#1976d2", "#1976d2"],
            hoverBackgroundColor: ["#1e88e5", "#1e88e5", "#1e88e5", "#1e88e5", "#1e88e5", "#1e88e5", "#1e88e5"],
            data: [48, 24, 32, 11, 19, 4, 3]
        }]
    }
    var myBarChart = new Chart(ctx2, {
        type: 'bar',
        data: data2,
        options: options2
    });

    ctx2.height = 200;




    // var data3 = {
    //     labels: ["1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015",],
    //     datasets: [{
    //         data: [1, 0, 1, 1, 2, 1, 2],
    //         borderColor: '#222',
    //         backgroundColor: '#D6E9C6',
    //     }, {
    //         data: [1, 0, 0, 0, 0, 1, 1],
    //     }]
    // }
    // var options3 = {
    //     scales: {
    //         xAxes: [{
    //             stacked: true,
    //             gridLines: {
    //                 display: false
    //             },
                
    //             barThickness: 24,
    //         }],
    //         yAxes: [{
    //             ticks: {
    //                 beginAtZero: true,
    //                 display: false,
    //                 max: 5,
    //                 min: 0,
    //                 stepSize: 1
    //             },
    //             gridLines: {
    //                 display: false,
    //                 drawBorder: false,
    //             },
    //             stacked: true
    //         }]
    //     },
    //     responsive: true,
    //     maintainAspectRatio: false,
    // }
    // var ctx3 = $("#time");
    // var myBarChart = new Chart(ctx3, {
    //     type: 'bar',
    //     data: data3,
    //     options: options3
    // });
    // ctx3.height = 200;
})