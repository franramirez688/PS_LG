
var testData1 = "http://s3.amazonaws.com/logtrust-static/test/test/data1.json";
var testData2 = "http://s3.amazonaws.com/logtrust-static/test/test/data2.json";
var testData3 = "http://s3.amazonaws.com/logtrust-static/test/test/data3.json";
var globalData = [];
var dates = new Set();

/**
 * Draw a Line chart.
 * @param {Array} datesAxis - List of dates values.
 * @param {Array} series - List of objects {name: "CAT 1", data: [4 5 7]}.
 */
function drawLineChart(datesAxis, series){
  Highcharts.chart('line_chart', {
      title: {
          text: 'Daily Category Value',
          x: -20 //center
      },
      xAxis: {
          categories: datesAxis
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
      series: series
  });
}

/**
 * Draw a Pie chart.
 * @param {Array} seriesData - List of objects {name: "CAT 1", y: 1244.254}.
 */
function drawPieChart(seriesData) {
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
          data: seriesData
      }]
  });
}

/**
  Retrieve data from AWS thanks to Ajax jQuery function getJSON .
*/
function requestData() {
  $.getJSON( testData1, function( data ) {
    var _date = undefined;
    _.each(data, function (item) {
      _date = moment(item.d).format("YYYY-MM-DD");
      globalData.push({
          category: item.cat.toUpperCase(),
          date: _date,
          value: item.value
      });
      dates.add(_date);
    });
  });

  $.getJSON( testData2, function( data ) {
    _.each(data, function (item) {
      globalData.push({
          category: item.categ,
          date: item.myDate,
          value: item.val
      });
      dates.add(item.myDate);
    });
  });

  $.getJSON( testData3, function( data ) {
    var date_regex = /\d{4}-\d{2}-\d{2}/g;  // regex to catch YYYY-MM-DD
    var _date = undefined;
    _.each(data, function (item) {
      _date = item.raw.match(date_regex)[0];
      globalData.push({
          category: item.raw.split(/#/g)[1],  // ["kjyj uyg ", "CAT 2", " kj bhhgh"]
          date: _date,
          value: item.val
      });
      dates.add(_date)
    });
  });
}

/**
  Retrieve data and draw charts
*/
$(document).ready(function() {
  $.when( requestData()  // Update all the data
).then(function() {  // Draw the charts
    var dataByCategory = _.groupBy(_.sortBy(globalData, 'date'), 'category');
    var datesAxis = Array.from(dates).sort();
    var categories = _.keys(dataByCategory).sort();
    var seriesLineChart = [];
    var seriesPieChart = [];

    // Iterate through each of available category
    _.each(categories, function(category) {
        var catValues = _.map(_.range(datesAxis.length), function () { return 0.00000000000000; });
        var indexValue = undefined;
        // Iterate through each of available data (objects) category
        _.each(dataByCategory[category], function(item) {
          // Accumulate values in the same date
          indexValue = datesAxis.indexOf(item.date);
          catValues[indexValue] += item.value;
        });

        seriesLineChart.push({
            name: category,
            data: catValues
        });
        seriesPieChart.push({
          name: category,
          y: _.reduce(catValues, function(memo, num){ return memo + num; }, 0)  // values sum
        });
    });

    drawLineChart(datesAxis, seriesLineChart);
    drawPieChart(seriesPieChart);
  });
});
