import Vue from 'vue/dist/vue.js'
import VueResource from 'vue-resource';
Vue.use(VueResource);

// import lineChart from '../components/lineChart/lineChart.js'

import { config } from './common.js'
import HomeUrgentIndicator from '../components/home_urgent_indicator.vue'
import HomeCompanyItem from '../components/home_company_item.vue'

(function(global){


    // Vue.component('urgent-indicator-item',
    //         HomeUrgentIndicator);
    // Vue.component('company-item',
    //         HomeCompanyItem);
    var root = new Vue({
             
        el:'#hty-home-component',
        data:{
            urgent_indicator_list:[] ,
            company_info_list:[] 
        },
        created:function(){
            this.fetch_urgent_indicator()
            this.fetch_company_list()
        },
        components:{
            HomeUrgentIndicator,
            HomeCompanyItem,
        },
        methods:{
            fetch_urgent_indicator:function(){
                this.$http.get('/get_urgent_indicator',{})
                    .then(function(res){
                        this.urgent_indicator_list = res.body.result.indicator_info_list
                    }) 
            }, 
            fetch_company_list:function(){
                this.$http.get('/get_company_list',{})
                    .then(function(res){
                        this.company_info_list = res.body.result.company_info_list
                    }) 
            } 
        }
        
    });


})(this);

