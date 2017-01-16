
var test_data1 = "http://s3.amazonaws.com/logtrust-static/test/test/data1.json";
var test_data2 = "http://s3.amazonaws.com/logtrust-static/test/test/data2.json";
var test_data3 = "http://s3.amazonaws.com/logtrust-static/test/test/data3.json";
var global_data = [];
var dates = new Set();

$.when(
    $.getJSON( test_data1, function( data ) {
      var _date = undefined;
      _.each(data, function (item) {
        _date = moment(item.d).format("YYYY-MM-DD");
        global_data.push({
            category: item.cat.toUpperCase(),
            date: _date,
            value: item.value
        });
        dates.add(_date);
      });
    }),
    $.getJSON( test_data2, function( data ) {
      _.each(data, function (item) {
        global_data.push({
            category: item.categ,
            date: item.myDate,
            value: item.val
        });
        dates.add(item.myDate);
      });
    }),
    $.getJSON( test_data3, function( data ) {
      var date_regex = /\d{4}-\d{2}-\d{2}/g;
      var _date = undefined;
      _.each(data, function (item) {
        _date = item.raw.match(date_regex)[0];
        global_data.push({
            category: item.raw.split(/#/g)[1],
            date: _date,
            value: item.val
        });
        dates.add(_date)
      });
    })
).then(function() {
    var data_by_category = _.groupBy(_.sortBy(global_data, 'date'), 'category');
    // console.log(_.groupBy(global_data, 'date'));
    var xAxis = Array.from(dates).sort();
    var categories = _.keys(data_by_category).sort();
    var series_line_chart = [];
    var series_pie_chart = [];

    _.each(categories, function(category) {
        var allDates = xAxis.slice()
        var allValues = _.map(_.range(xAxis.length), function () { return 0.00000000000000; });

        _.each(data_by_category[category], function(item) {
          var indexValue = allDates.indexOf(item.date);
          allValues[indexValue] += item.value;
        });

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
