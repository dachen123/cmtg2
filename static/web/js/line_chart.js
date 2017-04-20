import Vue from 'vue'
import VueResource from 'vue-resource';
Vue.use(VueResource);

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
                this.$http.get(config.server_domain+'/get_indicator_statistics_data',{})
                    .then(function(res){
                        this.datacollection = res.body.result.indicator_data_list;
                    })
            },
            getRandomInt: function() {
                return Math.floor(Math.random() * (50 - 5 + 1)) + 5
            }
        }
        
    });
    window.chart = chart 

})(this);


