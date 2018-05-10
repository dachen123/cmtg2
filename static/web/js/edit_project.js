import Vue from 'vue/dist/vue.js'
import VueResource from 'vue-resource';
Vue.use(VueResource);

// import lineChart from '../components/lineChart/lineChart.js'

import { config } from './common.js'

(function(global){

    var root = new Vue({
             
        el:'#hty-create-project',
        data:{
            project_id : "",
            project_name:"",
            project_image:"",
            project_desc:"",
            project_type:'default',
            leader_id:"",
            contact_id:"",
            create_user_id:"",
            inherit_type:"no",
            parent_id:"",
            error_msg:"",
        },
        http:{
            emulateJSON: true,
            emulateHTTP: true
        },
        created:function(){
            this.project_id = config.GetURLParameter('project_id');
            this.$http.get('/get_project_info',{
                params:{
                    project_id:this.project_id
                }
            })
                .then(function(res){
                    var r = config.parsebody(res.body);
                    var project_info = r.project_info;
                    this.project_name = project_info.project_name;
                    this.project_image = project_info.image;
                    this.project_desc = project_info.project_desc;
                    this.project_type = project_info.project_type;
                    this.leader_id = project_info.leader.user_id;
                    this.create_user_id = project_info.create_user.user_id;
                    this.contact_id  = project_info.contact.user_id;
                    this.parent_id = project_info.parent_project_id;
                    $('#p-create-datetimepicker').data('DateTimePicker').date(moment.unix(project_info.project_create_time));
                    $('#p-end-datetimepicker').data('DateTimePicker').date(moment.unix(project_info.project_end_time));
                    $('#participant-select').multiselect('select',project_info.participant);
                }) 
        
        
        },
        methods:{
            validate_input:function(){
                var notNull = true;
                var _m = this;
                $('#create-project-box [required]').each(function(){
                    if($.AdminLTE.utils.isNull($(this).val())){
                        notNull = false;  
                        $(this).addClass('validate-alert');
                        _m.error_msg = $(this).attr('data-error_msg');
                    }
                }); 
                return notNull;
            },
            update_project: function(){
                if(!this.validate_input()){
                    return ;
                }
                var p_create_time = $('#p-create-datetimepicker').data('DateTimePicker').date().unix();
                var p_end_time = $('#p-end-datetimepicker').data('DateTimePicker').date().unix();
                var parent_id = config.GetURLParameter('parent_id');
                var company_id = config.GetURLParameter('company_id');
                var participant = $('#participant-select').val();
                var data = {
                    project_id:this.project_id,
                    project_name:this.project_name,
                    project_image:this.project_image,
                    project_desc:this.project_desc,
                    project_type:this.project_type,
                    leader_id:this.leader_id,
                    contact_id:this.contact_id,
                    create_user_id:this.create_user_id,
                    project_create_time:p_create_time,
                    project_end_time:p_end_time,
                    company_id:company_id,
                    inherit_type:this.inherit_type,
                    participant :JSON.stringify(participant),
                }
                if (parent_id) {
                    data.parent_id = parent_id 
                }
                this.$http.post('/update_project',data
                ).then(function(r){
                    console.log(r.body);
                    var result = config.parsebody(r.body);
                    // localStorage.removeItem('sidebar_current_content');
                    window.onbeforeunload = null;
                    window.location.href = result.project_info.home_addr;
                    
                }) 
            }
        }
        
    });
    window.set_company_image = function(url){
     
        root.project_image = url;
    };

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
