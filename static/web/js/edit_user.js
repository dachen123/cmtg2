import Vue from 'vue/dist/vue.js'
import VueResource from 'vue-resource';
Vue.use(VueResource);


import { config } from './common.js'
// import HomeUrgentIndicator from '../components/home_urgent_indicator.vue'
import UserItem from '../components/user_item.vue'

(function(global){

        //日期选择器的使用:http://eonasdan.github.io/bootstrap-datetimepicker/Functions/#defaultdate
        //moment.js ：http://momentjs.com/docs/#/manipulating/local/
    // Vue.component('urgent-indicator-item',
    //         HomeUrgentIndicator);
    // Vue.component('company-item',
    //         HomeCompanyItem);
    
    var eventBus = new Vue({});

    var root = new Vue({
             
        el:'#user-list-root',
        data:{
            user_info_list:[] ,
            other_company_user:[],
            classify:"my_company"
        },
        http:{
            emulateJSON: true,
            emulateHTTP: true
        },
        created:function(){
            this.get_my_company_user()
        },
        components:{
            UserItem
        },
        methods:{
            get_my_company_user:function(){
                this.classify = "my_company";
                this.$http.get('/get_user_info_list',{
                    params:{
                        classify:'my_company' 
                    }
                })
                    .then(function(res){
                        this.user_info_list = res.body.result.user_info_list
                    }) 
            },
            get_other_company_user:function(){
                this.classify = "other_company";
                this.$http.get('/get_user_info_list',{
                    params:{
                        classify:'other_company' 
                    }
                })
                    .then(function(res){
                        this.other_company_user = res.body.result.user_info_list
                    }) 
            },
            get_child_data:function(user_info){
                eventBus.$emit('show_data',user_info,'update',this.classify);
            },
            create_user:function(){
                var user_info = {
                    user_id:"",
                    user_name:"",
                    image:"",
                    sex:"male",
                    job_level:"manager",
                    job_role:"invest",
                    phone:"",
                    email:"",
                    company:"",
                }
                eventBus.$emit('show_data',user_info,'create',this.classify);
            },
            del_user:function(user){
                if(!confirm('确认删除该用户?')){
                    return;
                }
                var _m = this;
                this.$http.post('/delete_user',{
                    user_id: user.user_id
                })
                    .then(function(res){
                        if( _m.classify == 'my_company'){
                            _m.get_my_company_user()
                        }else{
                            _m.get_other_company_user()
                        }
                    }) 
            }

        }
        
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
            company:"",
            oprate:'create',
            set_password:'true',
            user_password:"",
            confirm_user_password:"",
            error_msg:"",
            classify:"my_company"
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
                }else{
                    $('#user-password-div').hide(); 
                    $('#confirm-user-password-div').hide();
                }
                 
            },
            oprate:function(val){
                if (val=='create'){
                    $('#set-new-password-div').hide();
                    this.set_password = 'true';
                }
                else{
                
                    $('#set-new-password-div').show();
                    this.set_password = 'false';
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
                    set_password:this.set_password,
                    user_password:hex_md5(this.user_password),
                }
                if (this.company.length > 0){
                    data['company_id'] = this.company; 
                }
                if(this.oprate=='create'){
                    if (this.user_password != this.confirm_user_password){
                        this.error_msg='两次输入的密码不一致';
                        return ;
                    }
                    var _m = this;
                    this.$http.post('/create_user',data
                            ).then(function(r){
                        console.log(r.body);
                        var result = config.parsebody(r.body,function(result){
                            $('#add-new-user').modal('hide');
                            if( _m.classify == 'my_company'){
                                root.get_my_company_user()
                            }else{
                                root.get_other_company_user()
                            }
                        });
                    }) 
                }
                else {
                    data.user_id = this.user_id;
                    if(this.set_password == 'true'){
                        if (this.user_password != this.confirm_user_password){
                            this.error_msg='两次输入的密码不一致';
                            return ;
                        }
                    }
                    var _m = this;
                    this.$http.post('/update_user',data
                            ).then(function(r){
                        console.log(r.body);
                        var result = config.parsebody(r.body,function(result){
                            $('#add-new-user').modal('hide');
                            if( _m.classify == 'my_company'){
                                root.get_my_company_user()
                            }else{
                                root.get_other_company_user()
                            }
                        });

                    }) 
                }
            }
        
        },
        mounted:function(){
            eventBus.$on('show_data',function(user_info,op,classify){
                this.error_msg = "";
                this.oprate = op;
                this.user_id = user_info.user_id;
                this.user_name = user_info.name;
                this.image = user_info.image;
                this.job_level = user_info.job_level;
                this.job_role = user_info.job_role;
                this.phone = user_info.phone;
                this.sex = user_info.sex;
                this.email = user_info.email;
                this.company = user_info.company_id;
                this.classify = classify;
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

    // window.onload = function(){
        $('#member-superior-tree').tree({
            dragAndDrop: true,
            autoOpen:true
        }); 

        $('#trigger-member-superior-tree').on('click',function(){
            $.ajax({
                type:"GET",
                url:'/get_user_superior_tree',
                data:{},
                success:function(json){
                    $('#member-superior-tree').tree('loadData',json.result.user_superior);
                    $('#set-member-superior-modal').modal('show');
                },
                error: function () {
                    console.log('net error');
                }
            });
        });
        $('#save-member-superior-btn').on('click',function(){
            var user_superior = $('#member-superior-tree').tree('toJson');
            $.ajax({
                type:"POST",
                url:'/save_user_superior_tree',
                data:{
                    user_superior:user_superior
                },
                success:function(json){
                    config.parsebody(json,function(){
                        alert("保存成功!");
                        $('#set-member-superior-modal').modal('hide');
                    });
                },
                error: function () {
                    console.log('net error');
                }
            });

        });
        $('#cancel-oprate').on('click',function(){
            $('#set-member-superior-modal').modal('hide');
        });
    // }

})(this);

