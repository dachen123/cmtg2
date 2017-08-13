import Vue from 'vue/dist/vue.js'
import VueResource from 'vue-resource';
Vue.use(VueResource);

// import lineChart from '../components/lineChart/lineChart.js'

import { config } from './common.js'
// import HomeUrgentIndicator from '../components/home_urgent_indicator.vue'
import CompanyProjectItem from '../components/company_project_item.vue'

(function(global){

        //日期选择器的使用:http://eonasdan.github.io/bootstrap-datetimepicker/Functions/#defaultdate
        //moment.js ：http://momentjs.com/docs/#/manipulating/local/
    // Vue.component('urgent-indicator-item',
    //         HomeUrgentIndicator);
    // Vue.component('company-item',
    //         HomeCompanyItem);
    var root = new Vue({
             
        el:'#company-root-component',
        data:{
            project_info_list:[] ,
            company_id:"",
            // inherit_type:"no",
            // project_name: "",
            // project_desc: "",
            // project_image:"",
            // leader_id:"",
            // contact_id:"",
        },
        http:{
            emulateJSON: true,
            emulateHTTP: true
        },
        created:function(){
            this.company_id = config.GetURLParameter('company_id');
            this.fetch_project_list()
        },
        components:{
            CompanyProjectItem
        },
        methods:{
            fetch_project_list:function(){
                var project_id = config.GetURLParameter('project_id');
                // var company_id = config.GetURLParameter('company_id');
                var data = {
                    company_id:this.company_id
                }
                if (project_id){
                    data.project_id=project_id
                }
                this.$http.get('/get_project_list',{
                    params:data
                })
                    .then(function(res){
                        this.project_info_list = res.body.result.project_info_list
                    }) 
            },
            redirect_to_create:function(){
                var parent_id = config.GetURLParameter('parent_id');
                // var company_id = config.GetURLParameter('company_id');
                if (parent_id){
                    window.location.href="/create_project?company_id="+this.company_id+"&parent_id="+parent_id;
                }else{
                    window.location.href="/create_project?company_id="+this.company_id;
                }

                 
            },
            del_project:function(project){
                if( !confirm('确认删除项目？')){
                    return 
                }
                this.$http.post('/delete_project',{
                    project_id: project.project_id
                })
                    .then(function(res){
                        var _m = this;
                        var r = config.parsebody(res.body,function(result){
                            _m.fetch_project_list()
                        })
                    }) 
            }
        }
        
    });


    //结束公司
    $('#end-company-btn').on('click',function(){
        if(!confirm('结束监管将结束公司下所有项目，确认结束公司?')){
            return; 
        }
        var e = $(this);
        $.ajax({
            type: "POST",
            url:'/end_company',
            data: {
                company_id:root.company_id,
            },
            success: function (json) {
                config.parsebody(json,function(ret){
                    alert('结束成功!');
                    // e.replaceWith('<button type="button" class="btn btn-default">已结束</button>');
                    window.location.href=window.location.href;
                });
    
            },
            error: function () {
                console.log('网络繁忙，稍后重试');
            }
        }); 

    });

                              

    function input_html(attr_id,input_type,attr_name,attach_value,data){
        if (input_type != 'enum'){
            var html_str = '<div class="form-group company-attr clear-float">'
                +'<label class="col-sm-3 control-label">'+attr_name
                +'：</label><div class="col-sm-9"><input data-attr_id="'
                + attr_id + '" type="'+input_type+'" '
                +'class="form-control company-attr-input" value="'
                + (data || '')+'" style="border:0px;" disabled></div></div>'
        }else{
            var option_str = ''
            if(attach_value instanceof Array){
                for (var index in attach_value){
                    var option = attach_value[index];
                    if (option == data){
                        option_str += '<option value="'+option+'" selected>'
                            +option + '</option>'
                    }else{
                        option_str += '<option value="'+option+'">'
                            +option + '</option>'
                    
                    }
                } 
            }
            var html_str = '<div class="form-group company-attr clear-float">'
                +'<label class="col-sm-3 control-label">'+attr_name+'：</label>'
                +'<div class="col-sm-9">'
                +'<select style="border:0px;" disabled data-attr_id="'
                + attr_id +'" class="form-control company-attr-input" >'
                + option_str
                +'</select>'
                +'</div>'
                +'</div>'
        }
        return html_str;
    }

    function get_company_attr_info(company_id){
        $.ajax({
            type: "GET",
            url:'/get_company_attr_info',
            data:{
                company_id:company_id
            }, 
            success: function (json) {
                config.parsebody(json,function(ret){
                    var all_input_html = '';
                    for( var index in ret.company_attr_list){
                        var attr = ret.company_attr_list[index]; 
                        all_input_html += input_html(attr.attr_id,attr.input_type,attr.attr_name,attr.attach_value,attr.data);
                    }
                    $('#company-attr-list').empty();
                    $('#company-attr-list').append(all_input_html);
                });
    
            },
            error: function () {
                console.log('网络繁忙，稍后重试');
            }
        }); 
    }

    $('#save-company-attr').on('click',function(){
        var attr_info_list = [];
        $('#company-attr-list .company-attr-input').each(function(){

            var attr ={};
            attr['attr_id'] = $(this).attr('data-attr_id');
            attr['data'] = $(this).val();
            attr_info_list.push(attr);
                
        });
        $.ajax({
            type: "POST",
            url:'/set_company_attr_info',
            data:{
                company_id:root.company_id,
                attr_info_list:JSON.stringify(attr_info_list)
            }, 
            success: function (json) {
                config.parsebody(json,function(ret){
                    alert('保存成功');
                });
    
            },
            error: function () {
                console.log('网络繁忙，稍后重试');
            }
        }); 

    });

    $(get_company_attr_info(root.company_id));

    $('#company-tab-ul a').on('click',function(){
        var tab_id = $(this).attr('href');
        if (tab_id == '#tab_1'){
            root.fetch_project_list();
        }else{
            get_company_attr_info(root.company_id); 
        }
    });

    $('body').on('click','#edit-company-attr',function(){
        $('#company-attr-list .company-attr-input').each(function(){
            $(this).css('border','1px solid #d2d6de');
            $(this).removeAttr('disabled');
        });
        $(this).replaceWith('<button id="cancel-edit-attr" type="button" class="btn btn-success pull-right" style="margin-right:5px;">编辑取消</button>');
    });
    $('body').on('click','#cancel-edit-attr',function(){
        $('#company-attr-list .company-attr-input').each(function(){
            $(this).css('border','0px');
            $(this).attr('disabled','disabled');
        });
        $(this).replaceWith('<button id="edit-company-attr" type="button" class="btn btn-default pull-right" style="margin-right:5px;">编辑属性</button>');

    });


})(this);

