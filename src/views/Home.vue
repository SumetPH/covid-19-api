<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12 my-4">
        <h1 class="text-center">Covid-19 API</h1>
      </div>
    </div>

    <!-- date picker -->
    <div class="row">

      <div class="col-md-6">
        <b>From</b>
        <datepicker input-class="form-select" v-model="startDateSelect" @closed="dateChange"
          :disabled-dates="disabledDatesStart">
        </datepicker>
      </div>

      <div class="col-md-6">
        <b>To</b>
        <datepicker input-class="form-select" v-model="endDateSelect" @closed="dateChange"
          :disabled-dates="disabledDatesEnd">
        </datepicker>
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
              <td>{{ dataSet.cases[d].toLocaleString() }}</td>
              <td>{{ dataSet.deaths[d].toLocaleString() }}</td>
              <td>{{ dataSet.recovered[d].toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- footer -->
    <div class="row">
      <div class="col-md-12 my-4 text-center">
        <b>COVID-19 data sourced from Johns Hopkins University</b>
      </div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios'
  import Chart from '@/components/Chart.vue'
  import Datepicker from 'vuejs-datepicker';
  import moment from 'moment'


  export default {
    components: {
      Chart,
      Datepicker
    },
    data() {
      return {
        dataSet: {},
        dateList: [],
        startDateSelect: null,
        endDateSelect: null,
        disabledDatesStart: {},
        disabledDatesEnd: {},
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
        this.dataSet = res.data
        this.dateList = Object.keys(res.data.cases)

        // set start and end date
        this.startDateSelect = new Date(this.dateList[0])
        this.endDateSelect = new Date(this.dateList[this.dateList.length - 1])

        // disable date don't exits in dataSet
        this.disabledDatesStart = { to: this.startDateSelect, from: this.endDateSelect }
        this.disabledDatesEnd = { to: this.startDateSelect, from: this.endDateSelect }

        // create chart
        this.chart()
      })
    },
    computed: {
      // add date to table by start and end date
      tableDate() {
        // format date
        let startDateSelect = this.formatDate(this.startDateSelect)
        let endDateSelect = this.formatDate(this.endDateSelect)
        // find data from select date
        let indexStart = this.dateList.indexOf(startDateSelect)
        let indexEnd = this.dateList.indexOf(endDateSelect)
        let s = this.dateList.slice(indexStart, indexEnd + 1)
        return s
      },
    },
    methods: {
      // format date object to 'M/D/YY'
      formatDate(date) {
        return moment(date).format('M/D/YY')
      },

      // update data when date change
      dateChange() {
        let firstDateInData = new Date(this.dateList[0])
        let lastDateInData = new Date(this.dateList[this.dateList.length - 1])
        // disable date in caleder when date change
        this.disabledDatesStart = { from: this.endDateSelect, to: firstDateInData }
        this.disabledDatesEnd = { from: lastDateInData, to: this.startDateSelect }
        // update chart
        this.chart()
      },

      // for update chart
      chart() {
        // format date
        let startDateSelect = this.formatDate(this.startDateSelect)
        let endDateSelect = this.formatDate(this.endDateSelect)
        // find lable from dateList
        let start = this.dateList.indexOf(startDateSelect)
        let end = this.dateList.indexOf(endDateSelect)
        let labels = this.dateList.slice(start, end + 1)
        // update chart
        this.chartData = {
          labels: labels,
          datasets: [
            {
              label: "Cases",
              data: Object.values(this.dataSet.cases).slice(start, end + 1),
              backgroundColor: "#e17055",

            },
            {
              label: "Recovered",
              data: Object.values(this.dataSet.recovered).slice(start, end + 1),
              backgroundColor: "#00cec9",

            },
            {
              label: "Deaths",
              data: Object.values(this.dataSet.deaths).slice(start, end + 1),
              backgroundColor: "#b2bec3",

            },

          ],
        }
      },
    },
  }
</script>