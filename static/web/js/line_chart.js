import Vue from 'vue'
import lineChart from '../components/lineChart/lineChart.js'
import { config } from './common.js'

(function(global){
    window.config = config
    var chart = new Vue({
             
        el:'#cm-line-chart',
        data:{
            options: {
                responsive: true,
                title: {
                    display: false
                },
                legend: {
                    position: 'right'
                }

            },
            datacollection:{}

        },
        components:{
            lineChart 
        },
        mounted: function() {
            this.fillData()
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


