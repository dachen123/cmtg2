import Vue from 'vue/dist/vue.js'
import VueResource from 'vue-resource';
Vue.use(VueResource);


import { config } from './common.js'
// import CompanyProjectItem from '../components/company_project_item.vue'

(function(global){


    // Vue.component('urgent-indicator-item',
    //         HomeUrgentIndicator);
    // Vue.component('company-item',
    //         HomeCompanyItem);
    var root = new Vue({
             
        el:'#hty-edit-index',
        data:{
            read_interface:"false",
            indicator_name:"",
            indicator_proverty:"",
            forum:"",
            collect_period:"",
            project_id:"",
            indicator_id:null,
            data_value:"",
            data_desc:"",
            data_attachment:""
        },
        http:{
            emulateJSON: true,
            emulateHTTP: true
        },
        created:function(){
            // this.fetch_project_list()
            this.project_id = config.GetURLParameter('project_id');
            this.indicator_id = config.GetURLParameter('indicator_id');
            if (this.indicator_id){
                this.get_indicator_info();
            }
        },
        // components:{
        //     CompanyProjectItem
        // },
        methods:{
            // fetch_project_list:function(){
            //     this.$http.get(config.server_domain+'/get_project_list',{})
            //         .then(function(res){
            //             this.project_info_list = res.body.result.project_info_list
            //         }) 
            // }
            add_index: function(){
                this.$http.post('/create_indicator',{
                    read_interface:this.read_interface,
                    indicator_name:this.indicator_name,
                    indicator_proverty:this.indicator_proverty,
                    project_id:this.project_id,
                    forum:this.forum,
                    collect_period:this.collect_period
                }).then(function(r){
                    console.log(r.body);
                    this.indicator_id=r.body.result.indicator_info.indicator_id;
                    window.location.href='/edit_indicator?project_id='+this.project_id+'&indicator_id='+this.indicator_id;
                }) 
            },
            post_data:function(){
                if (this.indicator_id){
                    this.update_indicator();
                
                }
                else{
                    this.add_index(); 
                }
            },
            update_indicator:function(){
                this.$http.post('/update_indicator',{
                    indicator_id:this.indicator_id,
                    read_interface:this.read_interface,
                    indicator_name:this.indicator_name,
                    indicator_proverty:this.indicator_proverty,
                    project_id:this.project_id,
                    forum:this.forum,
                    collect_period:this.collect_period
                }).then(function(r){
                    console.log(r.body);
                    // this.indicator_id=r.body.result.indicator_info.indicator_id;
                    // window.location.href='/edit_indicator?project_id='+this.project_id+'&indicator_id='+this.indicator_id;
                    var indicator_info = r.body.result.indicator_info;
                    this.read_interface=indicator_info.read_interface;
                    this.indicator_name=indicator_info.indicator_name,
                    this.indicator_proverty=indicator_info.indicator_proverty,
                    this.forum=indicator_info.forum,
                    this.collect_period=indicator_info.collect_period
                }) 
            
            },
            get_indicator_info:function(){
                this.$http.get(config.server_domain+'/get_indicator_info',{
                    params:{
                        indicator_id:this.indicator_id
                    }
                }).then(function(res){
                    var indicator_info = res.body.result.indicator_info;
                    this.read_interface=indicator_info.read_interface;
                    this.indicator_name=indicator_info.indicator_name,
                    this.indicator_proverty=indicator_info.indicator_proverty,
                    this.forum=indicator_info.forum,
                    this.collect_period=indicator_info.collect_period
                
                });
            
            },
            post_i_data_by_manual:function(){
                var data_time = $('#i-data-datetimepicker').data('DateTimePicker').date().unix();
                this.$http.post('/post_i_data_by_manual',{
                    indicator_id: this.indicator_id,
                    project_id  : this.project_id,
                    data_value : this.data_value,
                    data_desc  : this.data_desc,
                    data_time   : data_time,
                    data_attachment: this.data_attachment
                }).then(function(r){
                    config.parsebody(r.body);
                    console.log(r.body);
                    // this.indicator_id=r.body.result.indicator_info.indicator_id;
                    // window.location.href='/edit_indicator?project_id='+this.project_id+'&indicator_id='+this.indicator_id;
                }) 
            }
        }
        
    });


})(this);

