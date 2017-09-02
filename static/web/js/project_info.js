import Vue from 'vue/dist/vue.js'
import VueResource from 'vue-resource';
Vue.use(VueResource);

// import lineChart from '../components/lineChart/lineChart.js'

import { config } from './common.js'
// import HomeUrgentIndicator from '../components/home_urgent_indicator.vue'
import ProjectChildItem from '../components/project_child_item.vue'
import ProjectIndicatorItem from '../components/project_indicator_item.vue'
import IndicatorItem from '../components/indicator_transplant_item.vue'

(function(global){


    // Vue.component('urgent-indicator-item',
    //         HomeUrgentIndicator);
    // Vue.component('company-item',
    //         HomeCompanyItem);
    var root = new Vue({
             
        el:'#project-root-component',
        data:{
            project_info_list:[] ,
            indicator_info_list:[],
            project_id:null,
            company_id:null,
            board_list:[],
            parent_inherit_indicators:[],
            project_clone_indicators:[],
            template_import_indicators:[],
            xml_import_indicators:[],
            brother_project_list:[],
            board_id:-1,
            check_parent_inherit_all:true,
            check_clone_indicator_all:true,
            indicator_start_index:1,
            indicator_count:15
        },
        http:{
            emulateJSON: true,
            emulateHTTP: true
        },
        created:function(){
            this.project_id = config.GetURLParameter('project_id');
            this.company_id = config.GetURLParameter('company_id');
            this.fetch_project_list()
            this.fetch_indicator_list()
            this.fetch_project_all_board(this.project_id)
            this.action_by_transt_type()
        },
        components:{
            ProjectChildItem,
            ProjectIndicatorItem,
            IndicatorItem
        },
        watch:{
            check_parent_inherit_all:function(val){
                var child_list = this.$refs.parent_inherit;
                for(var index in child_list){
                    child_list[index].is_checked=val; 
                }

            },
            check_clone_indicator_all:function(val){
                var child_list = this.$refs.project_clone;
                for(var index in child_list){
                    child_list[index].is_checked=val; 
                }

            } 
        },
        methods:{
            fetch_project_list:function(){
                var data = {
                    company_id:this.company_id
                }
                if (this.project_id){
                    data.project_id=this.project_id
                }
                this.$http.get('/get_project_list',{
                    params:data
                })
                    .then(function(res){
                        this.project_info_list = res.body.result.project_info_list
                    }) 
            },
            fetch_project_all_board:function(project_id,callback){
                this.$http.get('/get_project_all_board',{
                    params:{
                        project_id:project_id
                    }
                })
                .then(function(res){
                    this.board_list = res.body.result.board_info_list;
                    if(callback){
                        callback()
                    }
                }) 
            },
            fetch_indicator_list:function(){
                this.board_id = config.GetURLParameter('board_id');
                if(!this.board_id){
                    this.board_id = '-1'; 
                }
                this.$http.get('/get_indicator_list',{
                    params:{
                        project_id:this.project_id,
                        forum_id:this.board_id,
                        start_index:this.indicator_start_index,
                        count:this.indicator_count
                    }
                })
                    .then(function(res){
                        var r = config.parsebody(res.body);
                        if(r){
                            this.indicator_info_list = res.body.result.indicator_info_list
                        }
                    }) 
            },
            prev_page_indicator:function(){
                if(this.indicator_start_index == 1){
                    alert('已经在第一页了');
                    return
                }
                var prev_start_index = this.indicator_start_index - this.indicator_count;
                if(prev_start_index < 1){
                    this.indicator_start_index = prev_start_index;
                }else{
                    this.indicator_start_index = prev_start_index; 
                }
                this.$http.get('/get_indicator_list',{
                    params:{
                        project_id:this.project_id,
                        forum_id:this.board_id,
                        start_index:this.indicator_start_index,
                        count:this.indicator_count
                    }
                })
                    .then(function(res){
                        var r = config.parsebody(res.body);
                        if(r){
                            this.indicator_info_list = res.body.result.indicator_info_list
                        }
                    }) 

            },
            next_page_indicator:function(){
                var next_page_start = this.indicator_start_index + this.indicator_count;
                this.$http.get('/get_indicator_list',{
                    params:{
                        project_id:this.project_id,
                        forum_id:this.board_id,
                        start_index:next_page_start,
                        count:this.indicator_count
                    }
                })
                    .then(function(res){
                        var r = config.parsebody(res.body);
                        if(r){
                            var indicator_list = res.body.result.indicator_info_list;
                            if(indicator_list.length > 0){
                                this.indicator_info_list = indicator_list;
                                this.indicator_start_index = next_page_start;
                            }
                            else{
                            
                                alert('没有更多的数据了');
                            }
                        }
                    }) 
            },
            redirect_to_create:function(){
                window.location.href="/create_project?company_id="+this.company_id+"&parent_id="+this.project_id;
            
            },
            action_by_transt_type:function(event){
                var trans_type = 'parent_inherit';
                if(event){
                    trans_type = $(event.target).attr('data-trans_type');
                }
                if(trans_type == 'parent_inherit'){
                    this.get_indicators_by_parent_inherit()  
                }
            
            },
            get_project_all_indicators:function(){
                var project_id = $('#project-select').val();
                var root = this;
                this.fetch_project_all_board(project_id,function(){
                    root.$http.get('/get_project_all_indicators',{
                        params:{
                            project_id:project_id,
                        }
                    })
                    .then(function(res){
                        this.project_clone_indicators = res.body.result.indicator_list
                    }) 
                })
            },
            get_indicators_by_parent_inherit:function(){
                this.$http.get('/get_indicators_by_parent_inherit',{
                    params:{
                        project_id:this.project_id,
                    }
                })
                    .then(function(res){
                        this.parent_inherit_indicators = res.body.result.indicator_list
                    }) 

            },
            get_indicators_by_template_import:function(){
                this.$http.get('/get_indicators_by_template_import',{
                    params:{
                        project_id:this.project_id,
                    }
                })
                    .then(function(res){
                        this.template_import_indicators = res.body.result.indicator_list
                    }) 
            },
            post_indicator_list:function(indicator_list){
                this.$http.post('/batch_import_indicator',{indicator_list:indicator_list})
                    .then(function(res){
                        if(res.body.error_code=='OK'){
                            alert('上传成功!');
                            window.location.href=window.location.href;
                        } 
                    })
            },
            import_parent_inherit_indicator:function(){
                var child_list = this.$refs.parent_inherit;
                var indicator_list = [];
                for(var index in child_list){
                    var i = child_list[index]; 
                    if(i.is_checked){
                        var i_d = {
                            'indicator_name':i.item.indicator_name,
                            'indicator_property':i.item.indicator_property,
                            'project_id':this.project_id,
                            'board':i.item.forum.board_id,
                            'collect_period':i.item.collect_period
                        }
                        indicator_list.push(i_d);
                    }
                }
                this.post_indicator_list(JSON.stringify(indicator_list));

            },
            import_project_clone_indicator:function(){
                var child_list = this.$refs.project_clone;
                var indicator_list = [];
                for(var index in child_list){
                    var i = child_list[index]; 
                    if(i.is_checked){
                        var i_d = {
                            'indicator_name':i.item.indicator_name,
                            'indicator_property':i.item.indicator_property,
                            'project_id':this.project_id,
                            'board':i.item.forum.board_id,
                            'collect_period':i.item.collect_period
                        }
                        indicator_list.push(i_d);
                    }
                }
                this.post_indicator_list(JSON.stringify(indicator_list));

            },
            del_project:function(project){
                if(!confirm('确认删除项目？')){
                    return;
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
            },
            del_indicator:function(indicator){
                if(!confirm('确认删除指标？')){
                    return;
                }
                var _m = this;
                this.$http.post('/delete_indicator',{
                    indicator_id: indicator.indicator_id
                })
                    .then(function(res){
                        var r = config.parsebody(res.body,function(result){
                            _m.fetch_indicator_list()
                        });
                    }) 
            },
            redirect_to_excel_upload:function(){
                window.location.href='/upload_excel?project_id='+this.project_id+'&board_id='+this.board_id; 
            },
            create_special_indicator:function(){
                $('#project-indicator-box .overlay').show();
                var comp = this;
                this.$http.post('/create_special_indicator',{
                    project_id:this.project_id 
                })
                    .then(function(res){
                        config.parsebody(res.body,function(){
                            comp.fetch_indicator_list();
                            $('#project-indicator-box .overlay').hide();
                        })
                    }) 
            },
            start_project:function(){
                var comp = this;
                this.$http.post('/start_project',{
                    project_id:this.project_id 
                })
                    .then(function(res){
                        config.parsebody(res.body,function(){
                            comp.fetch_indicator_list();
                            $('#project-indicator-box .overlay').hide();
                        })
                    }) 
            },
            show_export_template_modal:function(){
                $('#export-template-modal').modal('show');
            },
        }
        
    });
    window.root=root;

    
    window.onload = function(){
        //调用接口获取新值
        $.ajax({
            type: "GET",
            url:'/get_project_inner_superior',
            data: {
                project_id:root.project_id
            },
            success: function (json) {
                config.parsebody(json,function(ret){
                    $('#project-inner-superior-tree').tree({
                        data:ret.inner_superior,
                        dragAndDrop: true,
                        autoOpen:true
                    });

                });
    
            },
            error: function () {
                console.log('net error');
            }
        }); 

        $('#save-inner-superior-tree').on('click',function(){
            var inner_superior = $('#project-inner-superior-tree').tree('toJson');
            $.ajax({
                type: "POST",
                url:'/save_project_inner_superior',
                data: {
                    project_id:root.project_id,
                    inner_superior:inner_superior
                },
                success: function (json) {
                    config.parsebody(json,function(ret){
                alert('保存成功!');
                    });

                },
                error: function () {
                    console.log('net error');
                }
            }); 
        });
    }
    $(document).ready(function() {
        $('#company-select').multiselect({
            includeSelectAllOption: false,
            enableFiltering: true,
            nonSelectedText: '请选择公司',
            numberDisplayed: 10,
            selectAllText: '全选',
            allSelectedText: '已选择所',
            onChange:function(option,checked,select){
                var company_id = option.val();
                rebuild_project_select(company_id);
            
            }
    
        });
        $('#project-select').multiselect({
            includeSelectAllOption: false,
            enableFiltering: true,
            nonSelectedText: '请选择项目',
            numberDisplayed: 10,
            allSelectedText: '已选择所有人'
        });

        $.ajax({
            type: "GET",
            url:'/get_default_clone_project',
            data: {
                project_id:root.project_id
            },
            success: function (json) {
                set_default_project(json.result);
            },
            error: function () {
                console.log('net error');
            }
        }); 
    });
    //project select rebulid
    function rebuild_project_select(company_id){
        //调用接口获取新值
        $.ajax({
            type: "GET",
            url:'/get_company_all_project',
            data: {
                company_id:company_id
            },
            success: function (json) {
                var elem = $("#project-select");
                elem.empty(); //清空原有的
                var p_list = json.result.project_info_list;
                for (var index in p_list){
                    elem.append("<option value='"+p_list[index].project_id+"'>"+p_list[index].project_name+"</option>");  //添加一项option
                }
                elem.get(0).selectedIndex=0;  //设置Select索引值为1的项选中 
                $('#project-select').multiselect('rebuild');
            },
            error: function () {
                console.log('net error');
            }
        }); 
    
    }

    function set_default_project(data){
        var company_select = $('#company-select');
        var project_select = $('#project-select');


        company_select.empty();
        var c_list = data.company_list;
        for( var index in c_list){

            company_select.append("<option value='"+c_list[index].company_id+"'>"+c_list[index].company_name+"</option>");  //添加一项option
        }
        company_select.val(data.company.company_id);
        company_select.multiselect('rebuild');

        project_select.empty(); //清空原有的
        var p_list = data.project_list;
        for (var index in p_list){
            project_select.append("<option value='"+p_list[index].project_id+"'>"+p_list[index].project_name+"</option>");  //添加一项option
        }
        project_select.val(data.project.project_id);
        project_select.multiselect('rebuild');

    
    }

    $(function(){
    
    });


    $('#update-board-trigger').on('click',function(){
        $.ajax({
            type: "GET",
            url:'/get_project_all_board',
            data: {
                project_id:root.project_id
            },
            success: function (json) {
                config.parsebody(json,function(ret){
                    var ol = $('#project-board-modal #project-board-list-ol');
                    ol.empty();
                    for(var index in ret.board_info_list){
                        var b = ret.board_info_list[index];

                        ol.append('<li data-board_id="'+b.board_id+'" style="padding:5px 0px;">'
                                +'<input class="input-sm form-control" '
                                +'style="width:40%;display:inline-block;"  '
                                +'value="'+b.name+'"></input><button class="btn btn-xs '
                                +'btn-danger pull-right delete-board">删除</button></li> ')
                    }
                    $('#project-board-modal').modal('show'); 
                });
    
            },
            error: function () {
                console.log('网络繁忙，稍后重试');
            }
        }); 
    });

    $('#project-board-modal #new-board').on('click',function(){
        $('#project-board-modal #project-board-list-ol').append('<li data-board_id="new" style="padding:5px 0px;">'
                +'<input class="input-sm form-control" '
                +'style="width:40%;display:inline-block;"  '
                +'value=""></input><button class="btn btn-xs '
                +'btn-danger pull-right delete-board">删除</button></li> ')
    })

    $('#project-board-modal').on('click','.delete-board',function(){
        $(this).parents('li').remove();
    });

    $('#project-board-modal #save-board').on('click',function(){
        var board_list = [];
        $('#project-board-modal #project-board-list-ol').find('li').each(function(){
            board_list.push({
                board_id:$(this).attr('data-board_id'),
                board_name:$(this).find('input').val()
            });
        });
        $.ajax({
            type: "POST",
            url:'/save_project_board',
            data: {
                project_id:root.project_id,
                board_list:JSON.stringify(board_list)
            },
            success: function (json) {
                config.parsebody(json,function(ret){
                    alert('保存成功');
                    $('#project-board-modal').modal('hide'); 
                });
    
            },
            error: function () {
                console.log('网络繁忙，稍后重试');
            }
        }); 
    });
    $('#project-board-modal #cancel-update').on('click',function(){
        $('#project-board-modal').modal('hide'); 
    });

    $('#start-project-btn').on('click',function(){
        if(!confirm('确认开启项目?')){
            return; 
        }
        var e = $(this);
        $.ajax({
            type: "POST",
            url:'/start_project',
            data: {
                project_id:root.project_id,
            },
            success: function (json) {
                config.parsebody(json,function(ret){
                    alert('开启成功');
                    e.replaceWith('<button id="end-project-btn" type="button" class="btn btn-success">结束项目</button>');
                });
    
            },
            error: function () {
                console.log('网络繁忙，稍后重试');
            }
        }); 

    });
    $('body').on('click','#end-project-btn',function(){
        if(!confirm('确认结束项目?')){
            return; 
        }
        var e = $(this);
        $.ajax({
            type: "POST",
            url:'/end_project',
            data: {
                project_id:root.project_id,
            },
            success: function (json) {
                config.parsebody(json,function(ret){
                    alert('结束成功');
                    // e.replaceWith('<button type="button" class="btn btn-default">已结束</button>');
                    window.location.href=window.location.href;
                });
    
            },
            error: function () {
                console.log('网络繁忙，稍后重试');
            }
        }); 

    });

    //date-ranger
    var startDate = moment().local().format('MM/DD/YYYY');
    var endDate = moment().local().add( moment.duration(1,'months'));
    var endDate = endDate.format('MM/DD/YYYY');
     
    $('#daterange-input').daterangepicker({
        "showDropdowns": true,
        "autoApply": true,
        "locale": {
            "format": "MM/DD/YYYY",
            "separator": " - ",
            "applyLabel": "确定",
            "cancelLabel": "取消",
            "fromLabel": "从",
            "toLabel": "到",
            "customRangeLabel": "Custom",
            "weekLabel": "W",
            "daysOfWeek": [
                "日",
                "一",
                "二",
                "三",
                "四",
                "五",
                "六"
            ],
            "monthNames": [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
            ],
            "firstDay": 1
        },
        "startDate": startDate,
        "endDate": endDate
    }, function(start, end, label) {
        startDate = start.format('MM/DD/YYYY');
        endDate = end.format('MM/DD/YYYY');
    });


    $('#export-template-btn').on('click',function(){
        event.preventDefault();
        var download_url = '/export_data_template_xls?project_id='+root.project_id+'&start_time='+startDate+'&end_time='+endDate;
        if( root.board_id > 0){
            download_url += '&board_id=' + root.board_id; 
        }
        window.downloadFile(download_url);

    });
    

})(this);

window.downloadFile = function (sUrl) {

    //iOS devices do not support downloading. We have to inform user about this.
    if (/(iP)/g.test(navigator.userAgent)) {
       //alert('Your device does not support files downloading. Please try again in desktop browser.');
       window.open(sUrl, '_blank');
       return false;
    }

    //If in Chrome or Safari - download via virtual link click
    if (window.downloadFile.isChrome || window.downloadFile.isSafari) {
        //Creating new link node.
        var link = document.createElement('a');
        link.href = sUrl;
        link.setAttribute('target','_blank');

        if (link.download !== undefined) {
            //Set HTML5 download attribute. This will prevent file from opening if supported.
            var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
            link.download = fileName;
        }

        //Dispatching click event.
        if (document.createEvent) {
            var e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
            return true;
        }
    }

    // Force file download (whether supported by server).
    if (sUrl.indexOf('?') === -1) {
        sUrl += '?download';
    }

    window.open(sUrl, '_blank');
    return true;
}

window.downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
window.downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;

