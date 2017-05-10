import Vue from 'vue/dist/vue.js'
import VueResource from 'vue-resource';
Vue.use(VueResource);

// import lineChart from '../components/lineChart/lineChart.js'

import { config } from './common.js'

(function(global){

    var root = new Vue({
             
        el:'#hty-create-project',
        data:{
            project_name:"",
            project_image:"",
            project_desc:"",
            leader_id:"",
            contact_id:"",
            inherit_type:"no",
        },
        http:{
            emulateJSON: true,
            emulateHTTP: true
        },
        created:function(){
        
        
        },
        methods:{
            add_project: function(){
                var p_create_time = $('#p-create-datetimepicker').data('DateTimePicker').date().unix();
                var p_end_time = $('#p-end-datetimepicker').data('DateTimePicker').date().unix();
                var parent_id = config.GetURLParameter('parent_id');
                var company_id = config.GetURLParameter('company_id');
                var participant = $('#participant-select').val();
                var data = {
                    project_name:this.project_name,
                    project_image:this.project_image,
                    project_desc:this.project_desc,
                    leader_id:this.leader_id,
                    contact_id:this.contact_id,
                    project_create_time:p_create_time,
                    project_end_time:p_end_time,
                    company_id:company_id,
                    inherit_type:this.inherit_type,
                    participant :JSON.stringify(participant),
                }
                if (parent_id) {
                    data.parent_id = parent_id 
                }
                this.$http.post('/add_project',data
                ).then(function(r){
                    console.log(r.body);
                    var result = config.parsebody(r.body);
                    window.location.href = result.project_info.home_addr;
                    
                }) 
            }
        }
        
    });

        var default_time = moment().local();
        $('#p-create-datetimepicker').datetimepicker({
            locale: 'zh-cn',
            format: 'MM/DD/YYYY',
            allowInputToggle:true,
            widgetPositioning:{
                horizontal: 'left',
                vertical: 'auto',
            },
            defaultDate:default_time
        });
        $('#p-end-datetimepicker').datetimepicker({
            locale: 'zh-cn',
            format: 'MM/DD/YYYY',
            allowInputToggle:true,
            widgetPositioning:{
                horizontal: 'left',
                vertical: 'auto',
            },
            defaultDate:default_time
        });
        $('#p-create-datetimepicker').on('dp.change',function(e){
            console.log(e); 
            console.log($('#p-create-datetimepicker').data('DateTimePicker').date().unix());
        });

})(this);
