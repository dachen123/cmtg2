import Vue from 'vue/dist/vue.js'
import VueResource from 'vue-resource';
Vue.use(VueResource);


import { config } from './common.js'
// import HomeUrgentIndicator from '../components/home_urgent_indicator.vue'
import EventItem from '../components/event_item.vue'


(function(global){

        //日期选择器的使用:http://eonasdan.github.io/bootstrap-datetimepicker/Functions/#defaultdate
        //moment.js ：http://momentjs.com/docs/#/manipulating/local/
    // Vue.component('urgent-indicator-item',
    //         HomeUrgentIndicator);
    // Vue.component('company-item',
    //         HomeCompanyItem);
    

    var root = new Vue({
             
        el:'#event-root-component',
        data:{
            e_type:'all',
            all_event_list:[] ,
            unsolve_event_list:[] ,
            unverify_event_list:[] ,
            solved_event_list:[] ,
            all_curent_page:1,
            all_per_page:15,
            unsolve_curent_page:1,
            unsolve_per_page:15,
            unverify_curent_page:1,
            unverify_per_page:15,
            solved_curent_page:1,
            solved_per_page:15,
            check_unsolve_event_all:false,
            check_unverify_event_all:false,
            handling_msg:''
        },
        http:{
            emulateJSON: true,
            emulateHTTP: true
        },
        created:function(){
            this.fetch_event_list()
        },
        components:{
            EventItem
        },
        methods:{
            fetch_event_list:function(event,e_type,page){
                var aevent_type='all';
                this.check_unsolve_event_all=false;
                this.check_unverify_event_all=false;
                if(e_type){
                    aevent_type = e_type;
                }
                else if(!e_type && event){
                  aevent_type = $(event.target).attr('data-e_type');
                  this.e_type = aevent_type;
                }
                var data={aevent_type:aevent_type}
                if(aevent_type == 'all'){
                    data['start_index'] = this.all_curent_page;
                    data['count'] = this.all_per_page;
                }else if(aevent_type == 'unsolve'){
                    data['start_index'] = this.unsolve_curent_page;
                    data['count'] = this.unsolve_per_page;
                }else if(aevent_type == 'unverify'){
                    data['start_index'] = this.unverify_curent_page;
                    data['count'] = this.unverify_per_page;
                }else{
                    data['start_index'] = this.solved_curent_page;
                    data['count'] = this.solved_per_page;
                }
                if(page){
                    data['start_index'] = page;
                }
                this.$http.get('/get_aevent_list_by_type',{
                    params:data
                })
                    .then(function(res){
                        var _m = this;
                        if(aevent_type == 'all'){
                            var r = config.parsebody(res.body,function(result){
                                _m.all_event_list = result.aevent_info_list;
                                _m.reset_paginator(aevent_type,result.current_page,result.total_page)
                            })
                        }else if(aevent_type == 'unsolve'){
                            var r = config.parsebody(res.body,function(result){
                                _m.unsolve_event_list = result.aevent_info_list;
                                _m.reset_paginator(aevent_type,result.current_page,result.total_page)
                            })
                        }else if(aevent_type == 'unverify'){
                            var r = config.parsebody(res.body,function(result){
                                _m.unverify_event_list = result.aevent_info_list;
                                _m.reset_paginator(aevent_type,result.current_page,result.total_page)
                            })
                        }else if(aevent_type == 'solved'){
                            var r = config.parsebody(res.body,function(result){
                                _m.solved_event_list = result.aevent_info_list;
                                _m.reset_paginator(aevent_type,result.current_page,result.total_page)
                            })
                        }
                    }) 
            },
            reset_paginator:function(aevent_type,current_page,total_page){
                var _m = this;
                var options = {
                    numberOfPages:5,
                    bootstrapMajorVersion:3,
                    onPageClicked: function(e,originalEvent,type,page){
                        _m.fetch_event_list(e,aevent_type,page)
                    }
                } 
                if(aevent_type == 'all'){
                    this.all_curent_page = current_page;
                    options['currentPage'] = current_page;
                    options['totalPages'] = total_page;
                    $('#all_aevent_paginator').bootstrapPaginator(options);
                }else if(aevent_type == 'unsolve'){
                    this.unsolve_curent_page = current_page;
                    options['currentPage'] = current_page;
                    options['totalPages'] = total_page;
                    $('#unsolve_aevent_paginator').bootstrapPaginator(options);
                }else if(aevent_type == 'unverify'){
                    this.unverify_curent_page = current_page;
                    options['currentPage'] = current_page;
                    options['totalPages'] = total_page;
                    $('#unverify_aevent_paginator').bootstrapPaginator(options);
                }else{
                    this.solved_curent_page = current_page;
                    options['currentPage'] = current_page;
                    options['totalPages'] = total_page;
                    $('#solved_aevent_paginator').bootstrapPaginator(options);
                }
            
            },
            batch_handle_post:function(){
                var child_list = this.$refs.unsolve_event_ref;
                var aevent_id_list = [];
                for(var index in child_list){
                    var i = child_list[index]; 
                    if(i.is_checked){
                        aevent_id_list.push(i.item.aevent_id);
                    }
                }
                if(aevent_id_list.length <= 0){
                    alert('没有选择任何事件');
                    return;
                }
                var _o = this;
                this.$http.post('/batch_solve_aevent',{
                    aevent_id_list:JSON.stringify(aevent_id_list),
                    flag:'true',
                    handling_msg:_o.handling_msg
                }).then(function(r){
                    var r = config.parsebody(r.body,function(){
                        _o.fetch_event_list(null,_o.e_type);
                        $('#batch-handle-modal').modal('hide');
                    });
                })

            },
            batch_pass_post:function(){
                var child_list = this.$refs.unverify_event_ref;
                var aevent_id_list = [];
                for(var index in child_list){
                    var i = child_list[index]; 
                    if(i.is_checked){
                        aevent_id_list.push(i.item.aevent_id);
                    }
                }
                if(aevent_id_list.length <= 0){
                    alert('没有选择任何事件');
                    return;
                }
                var _o = this;
                this.$http.post('/batch_solve_aevent',{
                    aevent_id_list:JSON.stringify(aevent_id_list),
                    flag:'true',
                    handling_msg:_o.handling_msg
                }).then(function(r){
                    var r = config.parsebody(r.body,function(){
                        _o.fetch_event_list(null,_o.e_type);
                        $('#batch-handle-modal').modal('hide');
                    });
                })
            },
            batch_reject_post:function(){
                var child_list = this.$refs.unverify_event_ref;
                var aevent_id_list = [];
                for(var index in child_list){
                    var i = child_list[index]; 
                    if(i.is_checked){
                        aevent_id_list.push(i.item.aevent_id);
                    }
                }
                if(aevent_id_list.length <= 0){
                    alert('没有选择任何事件');
                    return;
                }
                var _o = this;
                this.$http.post('/batch_solve_aevent',{
                    aevent_id_list:JSON.stringify(aevent_id_list),
                    flag:'false',
                    handling_msg:_o.handling_msg
                }).then(function(r){
                    var r = config.parsebody(r.body,function(){
                        _o.fetch_event_list(null,_o.e_type);
                        $('#batch-handle-modal').modal('hide');
                    });
                })

            },
            batch_handle_modal_show:function(){
                $('#batch-handle-modal').modal('show');
            },
            batch_verify_modal_show:function(){
                $('#batch-handle-modal').modal('show');
            },

        },
        watch:{
            check_unsolve_event_all:function(val){
                var child_list = this.$refs.unsolve_event_ref;
                for(var index in child_list){
                    child_list[index].is_checked=val; 
                }

            },
            check_unverify_event_all:function(val){
                var child_list = this.$refs.unverify_event_ref;
                for(var index in child_list){
                    child_list[index].is_checked=val; 
                }

            } 
        },
        
    });
    
    //分页器初始化
   var options = {
       currentPage: 1,
       totalPages: 1,
       numberOfPages:5,
       bootstrapMajorVersion:3,
   } 
   $('#all_aevent_paginator').bootstrapPaginator(options);
   $('#unsolve_aevent_paginator').bootstrapPaginator(options);
   $('#unverify_aevent_paginator').bootstrapPaginator(options);
   $('#solved_aevent_paginator').bootstrapPaginator(options);
})(this);

