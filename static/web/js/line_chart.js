import Vue from 'vue'
import VueResource from 'vue-resource';
Vue.use(VueResource);

// import lineChart from '../components/lineChart/lineChart.js'
import IndicatorTableItem from '../components/line_table_item.vue'
import { config } from './common.js'

(function(global){
    window.config = config
    var chart = new Vue({
             
        el:'#hty-chart',
        data:{
            options: {
                responsive: true,
                title: {
                    display: false
                },
                legend: {
                }

            },
            datacollection:{},
            indicator_id:"",
            project_id:"",
            tabledatacollection:[],

        },
        components:{
            // lineChart,
            IndicatorTableItem
        },
        mounted: function() {
            // this.fillData();
            this.get_indicator_table_list();
        },
        methods: {
            fillData: function() {
                // this.$http.get('/get_indicator_statistics_data',{})
                this.indicator_id = config.GetURLParameter('indicator_id');
                this.project_id = config.GetURLParameter('project_id');
                this.$http.get('/get_indicator_data_list',{
                    params:{
                        indicator_id:this.indicator_id,
                        project_id:this.project_id
                    }
                })
                    .then(function(res){
                        var ret = config.parsebody(res.body,function(ret){
                            // this.datacollection = res.body.result.indicator_data_list;
                            // this.datacollection = ret.indicator_data_list;
                        });
                        if (ret){
                            this.datacollection = ret.indicator_data_list;
                        
                        }
                    })
            },
            getRandomInt: function() {
                return Math.floor(Math.random() * (50 - 5 + 1)) + 5
            },
            get_indicator_table_list:function(params){
                if(!params){
                    var params = {};
                    var statistic_style = ['raw'];
                    params['statistic_style'] = JSON.stringify(statistic_style);
                    var period = config.GetURLParameter('period');
                    params['period'] = period;
                    var project_id = config.GetURLParameter('project_id');
                    var indicator_id = config.GetURLParameter('indicator_id');
                    var indicator = [{
                        'project_id'    :project_id,
                        'indicator_id'  :indicator_id
                    }];
                    params['show_expect'] = true;

                    params['indicator'] = JSON.stringify(indicator); 
                     
                }
                this.$http.get('/get_indicator_table_data_list',{
                    params:params
                })
                    .then(function(res){
                        var ret = config.parsebody(res.body,function(ret){
                        });
                        if (ret){
                            this.tabledatacollection = ret.table_data_list;
                        }
                    })
            }
        }
        
    });
    window.chart = chart 

})(this);


