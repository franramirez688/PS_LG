
var test_data1 = "http://s3.amazonaws.com/logtrust-static/test/test/data1.json";
var test_data2 = "http://s3.amazonaws.com/logtrust-static/test/test/data2.json";
var test_data3 = "http://s3.amazonaws.com/logtrust-static/test/test/data3.json";
var global_data = [];


$.when(
    $.getJSON( test_data1, function( data ) {
      _.each(data, function (item) {
        global_data.push({
            category: item.cat.toUpperCase(),
            date: moment(item.d).format("YYYY-MM-DD"),
            value: item.value
        });
      });
    }),
    $.getJSON( test_data2, function( data ) {
      _.each(data, function (item) {
        global_data.push({
            category: item.categ,
            date: item.myDate,
            value: item.val
        });
      });
    }),
    $.getJSON( test_data3, function( data ) {
      var date_regex = /\d{4}-\d{2}-\d{2}/g;
      _.each(data, function (item) {
        global_data.push({
            category: item.raw.split(/#/g)[1],
            date: item.raw.match(date_regex)[0],
            value: item.val
        });
      });
    })
).then(function() {
    var data_by_category = _.groupBy(_.sortBy(global_data, 'date'), 'category');
    var categories = _.keys(data_by_category).sort();
    var series_line_chart = [];
    var series_pie_chart = [];
    var xAxis = [];

    _.each(categories, function(category) {
        var allDates = [];
        var allValues = [];

        _.each(data_by_category[category], function(item) {
            var index = allDates.indexOf(item.date);
            if (index > -1){
                allValues[index] += item.value;
            }
            else {
                allDates.push(item.date);
                allValues.push(item.value);
            }
        });

        xAxis = _.union(xAxis, allDates);
        series_line_chart.push({
            name: category,
            data: allValues
        });
        series_pie_chart.push({
          name: category,
          y: _.reduce(allValues, function(memo, num){ return memo + num; }, 0)
        });
    });

    Highcharts.chart('line_chart', {
        title: {
            text: 'Daily Category Value',
            x: -20 //center
        },
        xAxis: {
            categories: xAxis
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: series_line_chart
    });

    Highcharts.chart('pie_chart', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Categories Total Values'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Categories',
            colorByPoint: true,
            data: series_pie_chart
        }]
    });

});
