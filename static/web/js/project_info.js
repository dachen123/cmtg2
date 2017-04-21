import Vue from 'vue/dist/vue.js'
import VueResource from 'vue-resource';
Vue.use(VueResource);

// import lineChart from '../components/lineChart/lineChart.js'

import { config } from './common.js'
// import HomeUrgentIndicator from '../components/home_urgent_indicator.vue'
import ProjectChildItem from '../components/project_child_item.vue'
import ProjectIndicatorItem from '../components/project_indicator_item.vue'

(function(global){


    // Vue.component('urgent-indicator-item',
    //         HomeUrgentIndicator);
    // Vue.component('company-item',
    //         HomeCompanyItem);
    var root = new Vue({
             
        el:'#project-root-component',
        data:{
            project_info_list:[] ,
            indicator_info_list:[]
        },
        created:function(){
            this.fetch_project_list()
            this.fetch_indicator_list()
        },
        components:{
            ProjectChildItem,
            ProjectIndicatorItem
        },
        methods:{
            fetch_project_list:function(){
                this.$http.get(config.server_domain+'/get_project_list',{})
                    .then(function(res){
                        this.project_info_list = res.body.result.project_info_list
                    }) 
            },
            fetch_indicator_list:function(){
                this.$http.get(config.server_domain+'/get_urgent_indicator',{})
                    .then(function(res){
                        this.indicator_info_list = res.body.result.indicator_info_list
                    }) 
            }
        }
        
    });


})(this);

