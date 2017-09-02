import Vue from 'vue/dist/vue.js'
import VueResource from 'vue-resource';
Vue.use(VueResource);


import { config } from './common.js'

(function(global){
    
    var eventBus = new Vue({});

    var root = new Vue({
        el:'#create-company-section',
        data:{
            company_name:"",
            company_image:"",
            company_desc:"",
            select_leader:"",
            select_contact:"",
            leader_type:"new",
            contact_type:"new",
            leader : {},
            contact: {}
        },
        http:{
            emulateJSON: true,
            emulateHTTP: true
        },
        watch:{

            leader_type:function(val){
                if(val=='select_exist'){
                    $('#company-leader-select').show();
                    $('#trigger-add-leader').hide();

                }else{
                    $('#company-leader-select').hide();
                    $('#trigger-add-leader').show();
                }
            },
            contact_type:function(val){
                if(val=='select_exist'){
                    $('#company-contact-select').show();
                    $('#trigger-add-contact').hide();

                }else{
                    $('#company-contact-select').hide();
                    $('#trigger-add-contact').show();
                }
            }
        },
        methods:{
            post_new_company:function(){
                if(!(this.company_name && this.company_name.length>0)){
                    alert('请输入公司名字'); 
                    return;
                }
                if(!(this.company_desc && this.company_desc.length>0)){
                    alert('请输入公司描述'); 
                    return;
                }
                if(this.leader_type == 'new' && !this.leader.user_name){
                    alert('请输入公司负责人'); 
                    return;
                
                }
                if(this.contact_type == 'new' &&!this.contact.user_name){
                    alert('请输入公司联系人'); 
                    return;
                }
                if( this.leader_type == 'select_exist' && this.select_leader == ""){
                    alert('请选择被投公司负责人');
                    return;
                }
                if( this.contact_type == 'select_exist' && this.select_contact == ""){
                    alert('请选择被投公司负责人');
                    return;
                }
                var participant = $('#participant-select').val();
                if( !(participant && participant.length > 0)){
                    alert('请输入公司参与人');
                    return;
                }
                $('#create-company-box .overlay').show();
                var data = {
                    company_name:this.company_name,
                    company_desc:this.company_desc,
                    company_image:this.company_image,

                    leader_name:this.leader.user_name,
                    leader_email:this.leader.email,
                    leader_image:this.leader.image,
                    leader_job_level:this.leader.job_level,
                    leader_job_role:this.leader.job_role,
                    leader_phone:this.leader.phone,
                    leader_sex:this.leader.sex,
                    leader_password:this.leader.user_password,

                    contact_name:this.contact.user_name,
                    contact_email:this.contact.email,
                    contact_image:this.contact.image,
                    contact_job_level:this.contact.job_level,
                    contact_job_role:this.contact.job_role,
                    contact_phone:this.contact.phone,
                    contact_sex:this.contact.sex,
                    contact_password:this.contact.user_password,

                    participant:JSON.stringify(participant),

                    leader_type:this.leader_type,
                    contact_type:this.contact_type,
                    select_leader:this.select_leader,
                    select_contact:this.select_contact
                
                }
                this.$http.post('/add_company_with_leader',data
                ).then(function(r){
                    console.log(r.body);
                    $('#create-company-box .overlay').hide();
                    var r = config.parsebody(r.body,function(result){
                        localStorage.removeItem('sidebar_current_content');
                        window.location.href='/company_info?company_id='+result.company_info.company_id;
                    });
                }) 
            },
            trigger_add_leader:function(){
                eventBus.$emit('show_data',this.leader,'leader');
            
            },
            trigger_add_contact:function(){
                eventBus.$emit('show_data',this.contact,'contact');
            }
        },


    
    });

    var modal = new Vue({
        el:'#add-new-user',
        data:{
            user_id:"",
            user_name:"",
            job_level:"manager",
            job_role:"invest",
            image:"",
            phone:"",
            sex  :"male",
            email:"",
            person:'leader',
            set_password:'true',
            user_password:"",
            confirm_user_password:"",
            error_msg:""
        },
        http:{
            emulateJSON: true,
            emulateHTTP: true
        },
        created:function(){
        
        },
        watch:{
            set_password:function(val){
                if (val == 'true'){
                    $('#user-password-div').show(); 
                    $('#confirm-user-password-div').show();
                }else if(val == 'false'){
                    $('#user-password-div').hide(); 
                    $('#confirm-user-password-div').hide();
                }else{
                    $('#user-password-div').show(); 
                    $('#confirm-user-password-div').show();
                
                }
                 
            },
            job_level:function(val){
                if(val == 'admin'){
                    $('#job-role-select option').attr('disabled','disabled');
                    $('#job-role-select option[value="none"]').removeAttr('disabled');
                    this.job_role="none";
                }else if(val == 'partner'){
                    $('#job-role-select option').attr('disabled','disabled');
                    $('#job-role-select option[value="all"]').removeAttr('disabled');
                    $('#job-role-select option[value="financial"]').removeAttr('disabled');
                    $('#job-role-select option[value="legal"]').removeAttr('disabled');
                    $('#job-role-select option[value="invest"]').removeAttr('disabled');
                    this.job_role="all";
                }else if(val == 'director'){
                    $('#job-role-select option').attr('disabled','disabled');
                    $('#job-role-select option[value="financial"]').removeAttr('disabled');
                    $('#job-role-select option[value="legal"]').removeAttr('disabled');
                    $('#job-role-select option[value="invest"]').removeAttr('disabled');
                    this.job_role="invest";
                
                }else if(val == 'manager'){
                    $('#job-role-select option').attr('disabled','disabled');
                    $('#job-role-select option[value="financial"]').removeAttr('disabled');
                    $('#job-role-select option[value="legal"]').removeAttr('disabled');
                    $('#job-role-select option[value="invest"]').removeAttr('disabled');
                    this.job_role="invest";
                }else if(val == 'master'){
                    $('#job-role-select option').attr('disabled','disabled');
                    $('#job-role-select option[value="input_master"]').removeAttr('disabled');
                    this.job_role="input_master";
                }else if(val == 'clerk'){
                    $('#job-role-select option').attr('disabled','disabled');
                    $('#job-role-select option[value="input_account"]').removeAttr('disabled');
                    this.job_role="input_account";
                }
            
            }
        },
        methods:{
            validate_input:function(){
                var notNull = true;
                var _m = this;
                $('#add-new-user input[required]').each(function(){
                    if($.AdminLTE.utils.isNull($(this).val())){
                        notNull = false;  
                        $(this).addClass('validate-alert');
                        _m.error_msg = $(this).attr('data-error_msg');
                    }
                }); 
                return notNull;
            },
            post_data:function(){
                if(!this.validate_input()){
                    return ;
                }
                var data = {
                    user_name :this.user_name,
                    job_level :this.job_level,
                    job_role  :this.job_role,
                    image     :this.image,
                    sex       :this.sex,
                    phone     :this.phone,
                    email     :this.email,
                    set_password:this.set_password || 'true',
                    user_password:this.user_password,
                    confirm_user_password:this.confirm_user_password
                }
                if (this.user_password != this.confirm_user_password){
                    this.error_msg='两次输入的密码不一致';
                    return ;
                }
                if (this.person == 'leader'){
                    root.leader = $.extend(true,root.leader,data);
                    $('#trigger-add-leader').html(this.user_name);
                    if(!root.contact.user_name){
                        root.contact = $.extend(true,root.contact,data);
                        $('#trigger-add-contact').html(this.user_name);
                    }
                }else if(this.person == 'contact'){
                    root.contact = $.extend(root.contact,data);
                    $('#trigger-add-contact').html(this.user_name);
                }
                $('#add-new-user').modal('hide');
            }
        
        },
        mounted:function(){
            eventBus.$on('show_data',function(user_info,person){
                this.person = person;
                this.error_msg = "";
                this.user_name = user_info.user_name;
                this.image = user_info.image;
                this.job_level = user_info.job_level || 'master';
                this.job_role = user_info.job_role || 'input_master';
                this.phone = user_info.phone;
                this.sex = user_info.sex || 'male';
                this.email = user_info.email;
                this.set_password = user_info.set_password;
                this.user_password = user_info.user_password;
                this.confirm_user_password = user_info.confirm_user_password;
                $('#add-new-user').modal('show');
                $('#add-new-user input.validate-alert').each(function(){
                    $(this).removeClass('validate-alert');
                });
            }.bind(this)); 
        }
        
    });
    window.set_modal_image = function(url){
     
        modal.image = url;
    };
    window.set_root_image = function(url){
     
        root.company_image = url;
    };
    
    $('#participant-select').multiselect({
        includeSelectAllOption: true,
        enableFiltering: true,
        buttonWidth: '100%',
        nonSelectedText: '请选择相关参与人',
        numberDisplayed: 10,
        selectAllText: '全选',
        allSelectedText: '已选择所有人'

    });


})(this);

