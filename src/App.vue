<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12 mt-5">
        <h1 class="text-center">Covid-19 API</h1>
      </div>
    </div>

    <!-- date picker -->
    <div class="row">
      <div class="col-md-6 mt-3">
        <b>From</b>
        <select class="form-select" v-model="startDate" @change="startDateChange">
          <option v-for="(d, index) in startDateArr" :key="index" :value="d">{{d}}</option>
        </select>
      </div>
      <div class="col-md-6 mt-3">
        <b>To</b>
        <select class="form-select" v-model="endDate" @change="endDateChange">
          <option v-for="(d, index) in endDateArr" :key="index" :value="d">{{d}}</option>
        </select>
      </div>
    </div>

    <!-- chart -->
    <div class="row">
      <div class="col-md-12 mt-5">
        <chart :chart-data="chartData" :options="options" :height="200"></chart>
      </div>
    </div>

    <!-- table -->
    <div class="row">
      <div class="col-md-12 mt-5">
        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Cases</th>
              <th>Deaths</th>
              <th>Recovered</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(d, index) in tableDate" :key="index">
              <td>{{d}}</td>
              <td>{{ covid.cases[d].toLocaleString() }}</td>
              <td>{{ covid.deaths[d].toLocaleString() }}</td>
              <td>{{ covid.recovered[d].toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- footer -->
    <div class="row">
      <div class="col-md-12 my-4 text-center">
        <b>COVID-19 data sourced from the New York Times</b>
      </div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios'
  import Chart from '@/components/Chart.vue'

  export default {
    components: {
      Chart
    },
    data() {
      return {
        date: [],
        covid: {},
        startDate: null,
        startDateArr: [],
        endDate: null,
        endDateArr: [],
        chartData: {},
        options: {
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                var label = data.datasets[tooltipItem.datasetIndex].label
                var value = data.datasets[0].data[tooltipItem.index];
                return `${label} : ${value.toLocaleString()}`
              }
            }
          },
          scales: {
            yAxes: [{
              ticks: {
                callback: function (value) {
                  return value.toLocaleString()
                }
              }
            }]
          }
        }
      }
    },
    mounted() {
      // fetch data from api
      axios.get('https://disease.sh/v3/covid-19/historical/all?lastdays=30').then(res => {
        // set data
        this.covid = res.data
        this.date = Object.keys(res.data.cases)

        // set start date
        this.startDate = this.date[0]
        this.startDateArr = this.date

        // set end date
        this.endDate = this.date[this.date.length - 1]
        this.endDateArr = this.date

        // create chart
        this.chart()
      })
    },
    computed: {
      // add date to table by start and end date
      tableDate() {
        let indexStart = this.date.indexOf(this.startDate)
        let indexEnd = this.date.indexOf(this.endDate)
        let s = this.date.slice(indexStart, indexEnd + 1)
        return s
      },
    },
    methods: {
      // for update chart
      chart() {
        let start = this.date.indexOf(this.startDate)
        let end = this.date.indexOf(this.endDate)
        let labels = this.date.slice(start, end + 1)

        this.chartData = {
          labels: labels,
          datasets: [
            {
              label: "Cases",
              data: Object.values(this.covid.cases).slice(start, end + 1),
              backgroundColor: "#e17055",

            },
            {
              label: "Recovered",
              data: Object.values(this.covid.recovered).slice(start, end + 1),
              backgroundColor: "#00cec9",

            },
            {
              label: "Deaths",
              data: Object.values(this.covid.deaths).slice(start, end + 1),
              backgroundColor: "#b2bec3",

            },

          ],
        }
      },

      // update data when start date change
      startDateChange() {
        let i = this.date.indexOf(this.startDate)
        let s = this.date.slice(i)
        this.endDateArr = s
        this.chart()
      },

      // update data when end date change
      endDateChange() {
        let i = this.date.indexOf(this.endDate)
        let s = this.date.slice(0, i + 1)
        this.startDateArr = s
        this.chart()
      },
    },
  }
</script>