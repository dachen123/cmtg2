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
        created:function(){
            this.fetch_user_list()
        },
        components:{
            UserItem
        },
        methods:{
            fetch_user_list:function(){
                this.$http.get(config.server_domain+'/get_user_info_list',{})
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
            oprate:'create'

        },
        http:{
            emulateJSON: true,
            emulateHTTP: true
        },
        created:function(){
        
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
                }
                if(this.oprate=='create'){
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
                    this.$http.post('/update_user',data
                            ).then(function(r){
                        console.log(r.body);
                        var result = config.parsebody(r.body);
                        $('#add-new-user').modal('hide');
                        root.fetch_user_list();

                    }) 
                
                }
            },
        
        },
        mounted:function(){
            eventBus.$on('show_data',function(user_info,op){
                this.oprate = op;
                this.user_id = user_info.user_id;
                this.user_name = user_info.name;
                this.image = user_info.image;
                this.job_level = user_info.job_level;
                this.job_role = user_info.job_role;
                // this.phone = user_info.phone;
                this.sex = user_info.sex;
                this.email = user_info.email;
                $('#add-new-user').modal('show');
            }.bind(this)); 
        }
        
    });
    window.set_modal_image = function(url){
     
        modal.image = url;
    };


})(this);

