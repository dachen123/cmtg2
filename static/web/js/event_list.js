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
            fetch_event_list:function(event){
                var aevent_type='all';
                if(event){
                  aevent_type =   $(event.target).attr('data-e_type');
                }
                this.$http.get('/get_aevent_list_by_type',{
                    params:{
                        aevent_type:aevent_type
                    }
                })
                    .then(function(res){
                        if(aevent_type == 'all'){
                            this.all_event_list = res.body.result.aevent_info_list
                        }else if(aevent_type == 'unsolve'){
                            this.unsolve_event_list = res.body.result.aevent_info_list
                        }else if(aevent_type == 'unverify'){
                            this.unverify_event_list = res.body.result.aevent_info_list
                        }else if(aevent_type == 'solved'){
                            this.solved_event_list = res.body.result.aevent_info_list
                        }
                    }) 
            }
        }
        
    });
})(this);

