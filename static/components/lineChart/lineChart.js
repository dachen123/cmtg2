// LineChart.js
import { Line, mixins } from 'vue-chartjs'
// const { reactiveProp } = mixins

export default Line.extend({
  mixins: [mixins.reactiveProp],
  data : function(){
        return{
        }  
  },
  props: ['options','chartData'],
  mounted: function() {
    // this.chartData is created in the mixin
    this.renderChart(this.chartData, this.options)
    // this.renderChart(this.data, this.options)
    // this.renderChart({
    //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //   datasets: [
    //     {
    //       label: 'Data One',
    //       backgroundColor: '#f87979',
    //       data: [40, 39, 10, 40, 39, 80, 40]
    //     }
    //   ]
    // }, {responsive: true, maintainAspectRatio: false})
    // this.renderChart({
    //   labels: [7,34],
    //   datasets: [
    //     {
    //       label: 'Data One',
    //       backgroundColor: '#f87979',
    //       data: [40, 43]
    //     },
    //
    //     {
    //       label: 'Data One',
    //       backgroundColor: '#f87979',
    //       data: [12, 6]
    //     }
    //   ]
    // }, {responsive: true, maintainAspectRatio: false})

  }
  // watch:{
  //    data:function( val,oldval){
  //        this.renderChart(val) 
  //    } 
  // }
})
