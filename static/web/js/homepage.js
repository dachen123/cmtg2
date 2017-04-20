import Vue from 'vue'
import VueResource from 'vue-resource';
Vue.use(VueResource);

// import lineChart from '../components/lineChart/lineChart.js'
import { config } from './common.js'

(function(global){

    Vue.component('urgent-indicator-item',
            require('../components/home_urgent_indicator.vue'));
    var news = new Vue({
             
        el:'#urgent-indicator-ul',
        data:{
            urgent_indicator_list:[] 
        },
        created:function(){
            this.fetch_urgent_indicator()
        },
        methods:{
            fetch_urgent_indicator:function(){
                this.$http.get(config.server_domain+'/get_urgent_indicator',{})
                    .then(function(res){
                        this.urgent_indicator_list = res.body.result.indicator_info_list
                    }) 
            } 
        }
        
    });


})(this);

