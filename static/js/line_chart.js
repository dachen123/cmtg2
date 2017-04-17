
import Vue from 'vue'
import lineChart from '../components/lineChart/lineChart.js'

(function(global){
    var chart = new Vue({
             
        el:'#cm-line-chart',
        data:{
            options: {
  responsive: true,
  // グラフタイトル
  title: {
    display: false
  },
  // 凡例
  legend: {
    position: 'right'
  }

            },


      //       datacollection: {
      // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      // datasets: [
      //   {
      //     label: 'Data One',
      //     backgroundColor: '#f87979',
      //     data: [40, 39, 10, 40, 39, 80, 40]
      //   }
      // ]}
      // datacollection 默认不能是null，否则数据不显示
            datacollection:{}

        },
        components:{
            lineChart 
        },
        mounted: function() {
            this.fillData()
    // setInterval(() => {
    //   this.fillData()
    // }, 1000)
            
        },
        methods: {
            fillData: function() {
                this.datacollection = {
                    labels: [this.getRandomInt(), this.getRandomInt()],
                    datasets: [
                    {
                        label: 'Data One',
                        backgroundColor: '#f87979',
                        data: [this.getRandomInt(), this.getRandomInt()]
                    }, {
                        label: 'Data One',
                        backgroundColor: '#f87979',
                        data: [this.getRandomInt(), this.getRandomInt()]
                    }
                    ]
                }
            },
            getRandomInt: function() {
                return Math.floor(Math.random() * (50 - 5 + 1)) + 5
            }
        }
        
    });
    window.chart = chart 

})(this);


