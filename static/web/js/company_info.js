import Vue from 'vue/dist/vue.js'
import VueResource from 'vue-resource';
Vue.use(VueResource);

// import lineChart from '../components/lineChart/lineChart.js'

import { config } from './common.js'
// import HomeUrgentIndicator from '../components/home_urgent_indicator.vue'
import CompanyProjectItem from '../components/company_project_item.vue'

(function(global){


    // Vue.component('urgent-indicator-item',
    //         HomeUrgentIndicator);
    // Vue.component('company-item',
    //         HomeCompanyItem);
    var root = new Vue({
             
        el:'#company-root-component',
        data:{
            project_info_list:[] ,
        },
        created:function(){
            this.fetch_project_list()
        },
        components:{
            CompanyProjectItem
        },
        methods:{
            fetch_project_list:function(){
                this.$http.get(config.server_domain+'/get_project_list',{})
                    .then(function(res){
                        this.project_info_list = res.body.result.project_info_list
                    }) 
            }
        }
        
    });


})(this);

