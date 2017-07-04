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
        },
        http:{
            emulateJSON: true,
            emulateHTTP: true
        },
        created:function(){
            this.fetch_user_list()
        },
        components:{
            UserItem
        },
        methods:{
            fetch_user_list:function(){
                this.$http.get('/get_user_info_list',{})
                    .then(function(res){
                        this.user_info_list = res.body.result.user_info_list
                    }) 
            },
            get_child_data:function(user_info){
                eventBus.$emit('show_data',user_info,'update');
            },
            create_user:function(){
                var user_info = {
                    user_id:"",
                    user_name:"",
                    image:"",
                    sex:"male",
                    job_level:"",
                    job_role:"",
                    phone:"",
                    email:"",
                    company:"",
                }
                eventBus.$emit('show_data',user_info,'create');
            },
            del_user:function(user){
                this.$http.post('/delete_user',{
                    user_id: user.user_id
                })
                    .then(function(res){
                        this.fetch_user_list()
                    }) 
            }

        }
        
    });

    var modal = new Vue({
        el:'#add-new-user',
        data:{
            user_id:"",
            user_name:"",
            job_level:"",
            job_role:"",
            image:"",
            phone:"",
            sex  :"male",
            email:"",
            company:"",
            oprate:'create',
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
            }
        },
        methods:{
            post_data:function(){
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
                if(this.oprate=='create'){
                    if (this.user_password != this.confirm_user_password){
                        this.error_msg='两次输入的密码不一致';
                        return ;
                    }
                    this.$http.post('/create_user',data
                            ).then(function(r){
                        console.log(r.body);
                        var result = config.parsebody(r.body);
                        $('#add-new-user').modal('hide');
                        root.fetch_user_list();

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
                    this.$http.post('/update_user',data
                            ).then(function(r){
                        console.log(r.body);
                        var result = config.parsebody(r.body);
                        $('#add-new-user').modal('hide');
                        root.fetch_user_list();

                    }) 
                
                }
            }
        
        },
        mounted:function(){
            eventBus.$on('show_data',function(user_info,op){
                this.oprate = op;
                this.user_id = user_info.user_id;
                this.user_name = user_info.name;
                this.image = user_info.image;
                this.job_level = user_info.job_level;
                this.job_role = user_info.job_role;
                this.phone = user_info.phone;
                this.sex = user_info.sex;
                this.email = user_info.email;
                $('#add-new-user').modal('show');
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

