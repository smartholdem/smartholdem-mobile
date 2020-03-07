import axios from "axios/index";

class Market {
  async priceHistory() {
    let result = {
      day: {
        values: [],
        labels: [],
      },
      week: {
        values: [],
        labels: [],
      },
      month: {
        values: [],
        labels: [],
      },
      min: 100,
      max: 0
    }

    let startDay = Math.floor(Date.now() / 1000) - 60 * 60 * 24
    try {
      let chartDay = (await axios.get('https://api.coinpaprika.com/v1/tickers/sth-smartholdem/historical?start=' + startDay + '&interval=1h')).data
      for (let i = 0; i < chartDay.length; i++) {
        result.day.values.push(chartDay[i].price)
        //result.day.labels.push(chartDay[i].timestamp.substr(11, 5)) //
        result.day.labels.push(new Date(new Date(chartDay[i].timestamp).getTime()).toLocaleTimeString().substr(0,5))
        if (result.min > chartDay[i].price) {
          result.min = chartDay[i].price
        }
        if (chartDay[i].price > result.max) {
          result.max = chartDay[i].price
        }
      }
    } catch (e) {

    }

    let startWeek = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 7
    try {
      let chartWeek = (await axios.get('https://api.coinpaprika.com/v1/tickers/sth-smartholdem/historical?start=' + startWeek + '&interval=1d')).data
      for (let i = 0; i < chartWeek.length; i++) {
        result.week.values.push(chartWeek[i].price)
        //result.week.labels.push((chartWeek[i].timestamp.substr(5, 5)).replace('-', '.'))
        result.week.labels.push(new Date(new Date(chartWeek[i].timestamp).getTime()).toLocaleDateString().substr(0,5))
        if (result.min > chartWeek[i].price) {
          result.min = chartWeek[i].price
        }
        if (chartWeek[i].price > result.max) {
          result.max = chartWeek[i].price
        }
      }
    } catch (e) {

    }

    let startMonth = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30
    try {
      let chartMonth = (await axios.get('https://api.coinpaprika.com/v1/tickers/sth-smartholdem/historical?start=' + startMonth + '&interval=1d')).data
      for (let i = 0; i < chartMonth.length; i++) {
        result.month.values.push(chartMonth[i].price)
        //result.month.labels.push((chartMonth[i].timestamp.substr(5, 5)).replace('-', '.'))
        result.month.labels.push(new Date(new Date(chartMonth[i].timestamp).getTime()).toLocaleDateString().substr(0,5))
        if (result.min > chartMonth[i].price) {
          result.min = chartMonth[i].price
        }
        if (chartMonth[i].price > result.max) {
          result.max = chartMonth[i].price
        }
      }
    } catch (e) {

    }

    return result
  }


  async getPriceChart() {
    let priceData = await this.priceHistory()

    let labels = [[],[],[]]
    labels[0] = priceData.day.labels
    labels[1] = priceData.week.labels
    labels[2] = priceData.month.labels

    let values = [[],[],[]]
    values[0] = priceData.day.values
    values[1] = priceData.week.values
    values[2] = priceData.month.values

    let result = {
      activeIndex: 0,
      labels: labels,
      values: values,
      min: priceData.min,
      max: priceData.max,

      chartData: {
        datasets: [{
          fill: true,
          borderColor: '#42b883',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: '#42b883',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: '#42b883',
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: labels[0]
        }],
        labels: values[0]
      },
      extraOptions: {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        responsive: true,
        tooltips: {
          backgroundColor: '#f5f5f5',
          titleFontColor: '#333',
          bodyFontColor: '#666',
          bodySpacing: 4,
          xPadding: 12,
          mode: 'nearest',
          intersect: 0,
          position: 'nearest'
        },
        scales: {
          yAxes: [
            {
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(29,140,248,0.0)',
                zeroLineColor: 'transparent'
              },
              ticks: {
                suggestedMin: priceData.min,
                suggestedMax: priceData.max,
                padding: 0.0002,
                fontColor: '#9a9a9a'
              }
            }
          ],
          xAxes: [
            {
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(225,78,202,0.1)',
                zeroLineColor: 'transparent'
              },
              ticks: {
                padding: 20,
                fontColor: '#9a9a9a'
              }
            }
          ]
        }
      },
      gradientColors: [
        'rgba(76, 211, 150, 0.1)',
        'rgba(53, 183, 125, 0)',
        'rgba(119,52,169,0)'
      ],
      gradientStops: [1, 0.4, 0],
      categories: []
    }

    return result

  }

}


export default new Market()
