import Vue from 'vue/dist/vue.js'
import VueResource from 'vue-resource';
Vue.use(VueResource);


import { config } from './common.js'
// import HomeUrgentIndicator from '../components/home_urgent_indicator.vue'
import AttrItem from '../components/company_attr_item.vue'

(function(global){

        //日期选择器的使用:http://eonasdan.github.io/bootstrap-datetimepicker/Functions/#defaultdate
        //moment.js ：http://momentjs.com/docs/#/manipulating/local/
    // Vue.component('urgent-indicator-item',
    //         HomeUrgentIndicator);
    // Vue.component('company-item',
    //         HomeCompanyItem);
    
    var eventBus = new Vue({});

    var root = new Vue({
             
        el:'#company-attr-root',
        data:{
            company_attr_list:[] ,
        },
        http:{
            emulateJSON: true,
            emulateHTTP: true
        },
        created:function(){
            this.get_company_attr_list()
        },
        components:{
            AttrItem
        },
        methods:{
            get_company_attr_list:function(){
                this.$http.get('/get_company_attr_list',{
                    params:{
                    }
                })
                    .then(function(res){
                        this.company_attr_list = res.body.result.company_attr_list
                    }) 
            },
            get_child_data:function(user_info){
                eventBus.$emit('show_data',user_info,'update');
            },
            create_company_attr:function(){
                var attr_info = {
                    attr_id:"",
                    input_type:"string",
                    attr_name:"",
                    attach_value:""
                }
                eventBus.$emit('show_data',attr_info,'create');
            },
            del_company_attr:function(attr){
                if(!confirm('确认删除公司属性？')){
                    return;
                }
                var _m = this;
                this.$http.post('/del_company_attr',{
                    attr_id: attr.attr_id
                })
                    .then(function(res){
                        _m.get_company_attr_list()
                    }) 
            }

        }
        
    });

    var modal = new Vue({
        el:'#update-company-attr-modal',
        data:{
            attr_id:"",
            attr_name:"",
            input_type:"string",
            attach_value:"",
            error_msg : "",
            oprate : "create",
        },
        http:{
            emulateJSON: true,
            emulateHTTP: true
        },
        created:function(){
        
        },
        watch:{
            input_type:function(val){
                if(val == 'enum'){
                    $('#attach-value-div').show(); 
                }else{
                    $('#attach-value-div').hide(); 
                } 
                
            }

        },
        methods:{
            validate_input:function(){
                // var notNull = true;
                // var _m = this;
                // $('#add-new-user input[required]').each(function(){
                //     if($.AdminLTE.utils.isNull($(this).val())){
                //         notNull = false;  
                //         $(this).addClass('validate-alert');
                //         _m.error_msg = $(this).attr('data-error_msg');
                //     }
                // }); 
                // return notNull;
            },
            post_data:function(){
                // if(!this.validate_input()){
                //     return ;
                // }
                var data = {
                    attr_name :this.attr_name,
                    input_type :this.input_type,
                }
                if(this.input_type == 'enum' && this.attach_value.length > 0){
                    var val_list = this.attach_value.split(/；|;/); 
                    data['attach_value'] = JSON.stringify(val_list);
                }
                if(this.oprate=='create'){
                    var _m = this;
                    this.$http.post('/add_company_attr',data
                            ).then(function(r){
                        var result = config.parsebody(r.body,function(result){
                            $('#update-company-attr-modal').modal('hide');
                            root.get_company_attr_list()
                        });
                    }) 
                }
                else {
                    data.attr_id = this.attr_id;
                    var _m = this;
                    this.$http.post('/update_company_attr',data
                            ).then(function(r){
                        var result = config.parsebody(r.body,function(result){
                            $('#update-company-attr-modal').modal('hide');
                            root.get_company_attr_list()
                        });

                    }) 
                }
            }
        
        },
        mounted:function(){
            eventBus.$on('show_data',function(attr_info,op){
                this.error_msg = "";
                this.oprate = op;
                this.attr_id = attr_info.attr_id;
                this.input_type = attr_info.input_type;
                this.attr_name = attr_info.attr_name;
                if(this.input_type == 'enum' && attr_info.attach_value.length > 0){
                    this.attach_value = attr_info.attach_value.join('；');
                }
                $('#update-company-attr-modal').modal('show');
                // $('#add-new-user input.validate-alert').each(function(){
                //     $(this).removeClass('validate-alert');
                // });
            }.bind(this)); 
        }
        
    });
    $('#popup-update-attr-modal').on('click',function(){
        $('#update-company-attr-modal').modal('show');
    });


})(this);

