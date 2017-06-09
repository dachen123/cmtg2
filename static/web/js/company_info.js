import Vue from 'vue/dist/vue.js'
import VueResource from 'vue-resource';
Vue.use(VueResource);

// import lineChart from '../components/lineChart/lineChart.js'

import { config } from './common.js'
// import HomeUrgentIndicator from '../components/home_urgent_indicator.vue'
import CompanyProjectItem from '../components/company_project_item.vue'

(function(global){

        //日期选择器的使用:http://eonasdan.github.io/bootstrap-datetimepicker/Functions/#defaultdate
        //moment.js ：http://momentjs.com/docs/#/manipulating/local/
    // Vue.component('urgent-indicator-item',
    //         HomeUrgentIndicator);
    // Vue.component('company-item',
    //         HomeCompanyItem);
    var root = new Vue({
             
        el:'#company-root-component',
        data:{
            project_info_list:[] ,
            // inherit_type:"no",
            // project_name: "",
            // project_desc: "",
            // project_image:"",
            // leader_id:"",
            // contact_id:"",
        },
        http:{
            emulateJSON: true,
            emulateHTTP: true
        },
        created:function(){
            this.fetch_project_list()
        },
        components:{
            CompanyProjectItem
        },
        methods:{
            fetch_project_list:function(){
                var project_id = config.GetURLParameter('project_id');
                var company_id = config.GetURLParameter('company_id');
                var data = {
                    company_id:company_id
                }
                if (project_id){
                    data.project_id=project_id
                }
                this.$http.get('/get_project_list',{
                    params:data
                })
                    .then(function(res){
                        this.project_info_list = res.body.result.project_info_list
                    }) 
            },
            redirect_to_create:function(){
                var parent_id = config.GetURLParameter('parent_id');
                var company_id = config.GetURLParameter('company_id');
                if (parent_id){
                    window.location.href="/create_project?company_id="+company_id+"&parent_id="+parent_id;
                }else{
                    window.location.href="/create_project?company_id="+company_id;
                }

                 
            },
            del_project:function(project){
                this.$http.post('/delete_project',{
                    project_id: project.project_id
                })
                    .then(function(res){
                        this.fetch_project_list()
                    }) 
            }
        }
        
    });


})(this);

