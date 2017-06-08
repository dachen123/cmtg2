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
            indicator_info_list:[],
            project_id:null,
            company_id:null
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
                this.project_id = config.GetURLParameter('project_id');
                this.company_id = config.GetURLParameter('company_id');
                var data = {
                    company_id:this.company_id
                }
                if (this.project_id){
                    data.project_id=this.project_id
                }
                this.$http.get('/get_project_list',{
                    params:data
                })
                    .then(function(res){
                        this.project_info_list = res.body.result.project_info_list
                    }) 
            },
            fetch_indicator_list:function(){
                this.$http.get('/get_indicator_list',{
                    params:{
                        project_id:this.project_id
                    }
                })
                    .then(function(res){
                        this.indicator_info_list = res.body.result.indicator_info_list
                    }) 
            },
            redirect_to_create:function(){
                window.location.href="/create_project?company_id="+this.company_id+"&parent_id="+this.project_id;
            
            }
        }
        
    });


})(this);

