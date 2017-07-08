import Vue from 'vue/dist/vue.js'
import VueResource from 'vue-resource';
Vue.use(VueResource);


import { config } from './common.js'
import IndicatorRuleItem from '../components/indicator_rule_item.vue'

(function(global){


    // Vue.component('urgent-indicator-item',
    //         HomeUrgentIndicator);
    // Vue.component('company-item',
    //         HomeCompanyItem);
    var root = new Vue({
             
        el:'#hty-edit-index',
        data:{
            read_interface:"false",
            indicator_name:"",
            indicator_property:"",
            forum:"",
            collect_period:"",
            project_id:"",
            indicator_id:null,
            data_value:"",
            data_bool_value:'1',
            data_desc:"",
            data_attachment:"",
            rule_info_list:[],
            rule_op:'create',
            rule_id:"",
            statistic_style:"raw",
            expect_value:"",
            compare_mode:"higher",
            compare_period:"none",
            check_time_type:"date",
            delay_days:"0",
            level:"",
            check_time:"",
            compare_target:"expect_value",
            rule_start_index:1,
            rule_count:10,
            compute_indicator_expression:"",
            is_compute_indicator:"false"
        },
        http:{
            emulateJSON: true,
            emulateHTTP: true
        },
        created:function(){
            // this.fetch_project_list()
            this.project_id = config.GetURLParameter('project_id');
            this.indicator_id = config.GetURLParameter('indicator_id');
            if (this.indicator_id){
                this.get_indicator_info();
                this.fetch_rule_list();
            }

        },
        components:{
            IndicatorRuleItem,
        },
        watch:{
            compare_target:function(value){
                var expect_input = document.getElementById('import-expect-value-region');
                var select_indicator = document.getElementById('filter-indicator-region');
                if(value == 'expect_value'){
                    expect_input.style.display='inline-block';
                    select_indicator.style.display='none';
                }else{
                    expect_input.style.display='none';
                    select_indicator.style.display='inline-block';
                }
            },
            compare_period:function(val){
                if( val=='month' ) {
                    $('#check_time_type').prop('disabled',false); 
                    $('#check_time_type option[value="season_end"]').attr('disabled','disabled').siblings().removeAttr('disabled'); 
                }else if(val == 'season'){
                    $('#check_time_type').prop('disabled',false); 
                    $('#check_time_type option[value="month_end"]').attr('disabled','disabled').siblings().removeAttr('disabled'); 
                }else{
                    this.check_time_type="date"; 
                    $('#check_time_type').prop('disabled',true); 
                }
            },
            check_time_type:function(val){
                if( val== 'month_end' || val=='season_end'){
                    $('#rule-datetimepicker').hide();
                }else{
                    $('#rule-datetimepicker').show();
                } 
            },
            indicator_property:function(val){
                if (val=='boolean'){
                    $('#input-index-data-div').hide(); 
                    $('#input-index-bool-data-div').show(); 
                }else{
                    $('#input-index-data-div').show(); 
                    $('#input-index-bool-data-div').hide(); 
                }
            }
        },
        methods:{
            // fetch_project_list:function(){
            //     this.$http.get(config.server_domain+'/get_project_list',{})
            //         .then(function(res){
            //             this.project_info_list = res.body.result.project_info_list
            //         }) 
            // }
            add_index: function(){
                this.$http.post('/create_indicator',{
                    read_interface:this.read_interface,
                    indicator_name:this.indicator_name,
                    indicator_property:this.indicator_property,
                    project_id:this.project_id,
                    forum:this.forum,
                    collect_period:this.collect_period
                }).then(function(r){
                    console.log(r.body);
                    this.indicator_id=r.body.result.indicator_info.indicator_id;
                    // localStorage.removeItem('sidebar_current_content');
                    window.location.href='/edit_indicator?project_id='+this.project_id+'&indicator_id='+this.indicator_id;
                }) 
            },
            post_data:function(){
                this.check_compute_indicator_expression();
                return;
                if (this.indicator_id){
                    this.update_indicator();
                
                }
                else{
                    this.add_index(); 
                }
            },
            update_indicator:function(){
                this.$http.post('/update_indicator',{
                    indicator_id:this.indicator_id,
                    read_interface:this.read_interface,
                    indicator_name:this.indicator_name,
                    indicator_property:this.indicator_property,
                    project_id:this.project_id,
                    forum:this.forum,
                    collect_period:this.collect_period
                }).then(function(r){
                    console.log(r.body);
                    // this.indicator_id=r.body.result.indicator_info.indicator_id;
                    // window.location.href='/edit_indicator?project_id='+this.project_id+'&indicator_id='+this.indicator_id;
                    // localStorage.removeItem('sidebar_current_content');
                    var indicator_info = r.body.result.indicator_info;
                    this.read_interface=indicator_info.read_interface;
                    this.indicator_name=indicator_info.indicator_name,
                    this.indicator_property=indicator_info.indicator_property,
                    this.forum=indicator_info.forum,
                    this.collect_period=indicator_info.collect_period
                }) 
            
            },
            set_rule_cascader_select_val:function(data){
                var indicator_select = $('#indicator-select');
                var company_select = $('#company-select');
                var project_select = $('#project-select');
                var board_select = $('#board-select');

                company_select.val(data.company.company_id);
                company_select.multiselect('refresh');

                indicator_select.empty(); //清空原有的
                var i_list = data.indicator_list;
                for (var index in i_list){
                    indicator_select.append("<option value='"+i_list[index].indicator_id+"'>"+i_list[index].indicator_name+"</option>");  //添加一项option
                }
                indicator_select.val(data.indicator.indicator_id);
                indicator_select.multiselect('rebuild');

                project_select.empty(); //清空原有的
                var p_list = data.project_list;
                for (var index in p_list){
                    project_select.append("<option value='"+p_list[index].project_id+"'>"+p_list[index].project_name+"</option>");  //添加一项option
                }
                project_select.val(data.project.project_id);
                project_select.multiselect('rebuild');

                board_select.empty();//清空原有的
                var b_list = data.board_list;
                for (var index in b_list){
                    board_select.append("<option value='"+b_list[index].board_id+"'>"+b_list[index].name+"</option>");  //添加一项option
                }
                board_select.val(data.board.board_id);
                board_select.multiselect('refresh');

            },
            get_indicator_info:function(){
                this.$http.get('/get_indicator_info',{
                    params:{
                        indicator_id:this.indicator_id
                    }
                }).then(function(res){
                    var indicator_info = res.body.result.indicator_info;
                    this.read_interface=indicator_info.read_interface;
                    this.indicator_name=indicator_info.indicator_name,
                    this.indicator_property=indicator_info.indicator_property,
                    this.forum=indicator_info.forum.board_id,
                    this.collect_period=indicator_info.collect_period
                
                });
            
            },
            post_i_data_by_manual:function(){
                var data_time = $('#i-data-datetimepicker').data('DateTimePicker').date().unix();
                var data_value = null;
                if(this.indicator_property == 'boolean'){
                    data_value=this.data_bool_value; 
                }else{
                    data_value=this.data_value; 
                }
                this.$http.post('/post_i_data_by_manual',{
                    indicator_id: this.indicator_id,
                    project_id  : this.project_id,
                    data_value : data_value,
                    data_desc  : this.data_desc,
                    data_time   : data_time,
                    data_attachment: this.data_attachment
                }).then(function(r){
                    config.parsebody(r.body,function(){
                        $('#manual-upload-success-tip').modal('show');
                    });
                    console.log(r.body);
                    // this.indicator_id=r.body.result.indicator_info.indicator_id;
                    // window.location.href='/edit_indicator?project_id='+this.project_id+'&indicator_id='+this.indicator_id;
                    
                }) 
            },
            redirect_to_chart:function(){
                    window.location.href='/chart?project_id='+this.project_id+'&indicator_id='+this.indicator_id+'&period='+this.collect_period;
            
            },
            fetch_rule_list:function(){
                this.$http.get('/get_rule_list',{params:{
                    indicator_id:this.indicator_id,
                    start_index:this.rule_start_index,
                    count:this.rule_count
                }})
                    .then(function(res){
                        console.log(res.body);
                        var r = config.parsebody(res.body);
                        if(r){
                            this.rule_info_list = res.body.result.rule_info_list;
                        }
                    }) 
            
            },
            prev_page_rule:function(){
                if (this.rule_start_index == 1){
                    alert('已经在第一页了'); 
                    return;
                }
                var prev_page_start =  this.rule_start_index - this.rule_count;
                if (prev_page_start < 1){
                    this.rule_start_index = 1;
                }else{
                    this.rule_start_index = prev_page_start;
                }
                this.$http.get('/get_rule_list',{params:{
                    indicator_id:this.indicator_id,
                    start_index:this.rule_start_index,
                    count:this.rule_count
                }})
                    .then(function(res){
                        console.log(res.body);
                        var r = config.parsebody(res.body);
                        if(r){
                            this.rule_info_list = res.body.result.rule_info_list;
                        }
                    }) 
            },
            next_page_rule:function(){
                var next_page_start = this.rule_start_index + this.rule_count;
                this.$http.get('/get_rule_list',{params:{
                    indicator_id:this.indicator_id,
                    start_index:next_page_start,
                    count:this.rule_count
                }})
                    .then(function(res){
                        var r = config.parsebody(res.body);
                        if(r){
                            var rule_list = res.body.result.rule_info_list;
                            if(rule_list.length > 0){
                                this.rule_info_list = res.body.result.rule_info_list;
                                this.rule_start_index = next_page_start;
                            }
                            else{
                                alert('没有更多数据了'); 
                            }
                        }
                    }) 

            },
            show_add_rule_box:function(){
                // var check_time = $('#rule-datetimepicker').data('DateTimePicker').date().unix(); 
                // this.$http.post('/add_rule',{
                //     indicator_id:this.indicator_id,
                //     expect_value:this.expect_value,
                //     check_time:check_time
                // })
                //     .then(function(res){
                //         this.rule_info_list = res.body.result.rule_info_list
                //     }) 
                this.rule_op = 'create';
                // $('.table-add-item').toggle('fast');
                $('.table-add-item').show();
            },
            cancel_op:function(){
                $('.table-add-item').hide();
            },
            post_rule_data:function(){
                var check_time = $('#rule-datetimepicker').data('DateTimePicker').date().unix(); 
                var data = {
                        indicator_id:this.indicator_id,
                        expect_value:this.expect_value,
                        compare_mode:this.compare_mode,
                        statistic_style:this.statistic_style,
                        compare_target:this.compare_target,
                        compare_period:this.compare_period,
                        delay_days:this.delay_days,
                }
                if(this.check_time_type == 'date'){
                    data['check_time']=check_time
                }
                if( this.compare_target == 'indicator'){
                    var indicator_id = $('#indicator-select').val();
                    if (indicator_id){
                        data.related_indicator_id = indicator_id;
                    }else{
                        alert('未获取到选择的指标'); 
                        return;
                    }
                }
                if(this.rule_op=='create'){
                    this.$http.post('/add_rule',data)
                        .then(function(res){
                            console.log(res.body);
                            var r = config.parsebody(res.body);
                            if (r){
                                // $('.table-add-item').toggle('fast');
                                $('.table-add-item').hide();
                                this.fetch_rule_list();
                                $('#manual-upload-success-tip').modal('show');
                            }
                        }) 
                }else{
                    data.rule_id = this.rule_id,
                    this.$http.post('/update_rule',data)
                        .then(function(res){
                            console.log(res.body);
                            var r = config.parsebody(res.body);
                            if (r){
                                // $('.table-add-item').toggle('fast');
                                $('.table-add-item').hide();
                                this.fetch_rule_list();
                                $('#manual-upload-success-tip').modal('show');
                            }
                        }) 
                }
            
            },
            get_inidactor_cascader_select_val(indicator_id){
                this.$http.get('/get_rule_cascader_select_val',{params:{
                    indicator_id:indicator_id
                }})
                    .then(function(res){
                        console.log(res.body);
                        var r = config.parsebody(res.body);
                        if(r){
                            this.set_rule_cascader_select_val(res.body.result);
                        }
                    }) 
            },
            get_child_rule_data:function(rule_info){
                this.rule_op = 'update';
                this.rule_id = rule_info.rule_id;
                this.expect_value = rule_info.expect;
                this.compare_target = rule_info.compare_target;
                this.compare_period = rule_info.repeat_period;
                this.compare_mode = rule_info.compare_mode;
                this.delay_days = rule_info.delay_days;
                if (this.compare_target == 'indicator'){
                    this.get_inidactor_cascader_select_val(rule_info.related_indicator_id);
                }
                if(rule_info.check_time){
                    $('#rule-datetimepicker').data('DateTimePicker').date(moment.unix(rule_info.check_time));
                }
                if( !rule_info.check_time && rule_info.repeat_period == 'month'){
                    //选了月末
                    this.check_time_type = 'month_end';
                }else if( !rule_info.check_time && rule_info.repeat_period == 'season'){
                    this.check_time_type = 'season_end';
                }else{
                    this.check_time_type = 'date';
                }


                if(rule_info.repeat_period == 'month' || rule_info.repeat_period == 'season'){
                    $('#check_time_type').prop('disabled',false);
                }else{
                    $('#check_time_type').prop('disabled',true);
                }
                // $('.table-add-item').toggle('fast');
                $('.table-add-item').show();

            },
            del_rule:function(rule){
                this.$http.post('/delete_rule',{
                    rule_id: rule.rule_id
                })
                    .then(function(res){
                        this.fetch_rule_list()
                    }) 
            
            },
            check_compute_indicator_expression:function(){
                var expression = this.compute_indicator_expression.replace(/\s+/g,'');
                console.log(expression);
                var i_name_list = expression.match(/[^.,<>+\-*/()[\]{}^&|%0-9]+/g);
                console.log(i_name_list);
                 
            }
        }
        
    });
    window.root=root;

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
            allSelectedText: '已选择所有人',
            onChange:function(option,checked,select){
                console.log(option+','+checked+','+select);
                var company_id = $('#company-select').val();
                var project_id = option.val()
                var forum_id = $('#board-select').val();
                rebuild_board_select(project_id);
                 
            }
    
    
        });
        $('#board-select').multiselect({
            includeSelectAllOption: false,
            enableFiltering: true,
            nonSelectedText: '请选择版块',
            numberDisplayed: 10,
            allSelectedText: '已选择所有人',
            onChange:function(option,checked,select){
                var company_id = $('#company-select').val();
                var project_id = $('#project-select').val()
                var forum_id = option.val();
                rebuild_indicator_select(company_id,project_id,forum_id);
            
            }
    
        });
        $('#indicator-select').multiselect({
            includeSelectAllOption: true,
            enableFiltering: true,
            nonSelectedText: '请选择指标',
            numberDisplayed: 10,
            selectAllText: '全选',
            allSelectedText: '已选择所有指标'
    
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
                var forum_id = $("#board-select").val();
                var project_id = elem.val();
                rebuild_indicator_select(company_id,project_id,forum_id);
    
            },
            error: function () {
                console.log('net error');
            }
        }); 
    
    }
    //board select
    function rebuild_board_select(project_id){
        //调用接口获取新值
        $.ajax({
            type: "GET",
            url:'/get_project_all_board',
            data: {
                project_id:project_id
            },
            success: function (json) {
                var elem = $("#board-select");
                elem.empty(); //清空原有的
                var b_list = json.result.board_info_list;
                for (var index in b_list){
                    elem.append("<option value='"+b_list[index].board_id+"'>"+b_list[index].name+"</option>");  //添加一项option
                }
                elem.get(0).selectedIndex=0;  //设置Select索引值为1的项选中 
                $('#board-select').multiselect('rebuild');
                var forum_id = elem.val();
                var project_id = $('#project-select').val();
                var company_id = $('#company-select').val();
                rebuild_indicator_select(company_id,project_id,forum_id);

            },
            error: function () {
                console.log('net error');
            }
        }); 

    }
    
    function rebuild_indicator_select(company_id,project_id,forum_id){
        //调用接口获取新值
        $.ajax({
            url:'/get_indicator_list_by_condition',
            type: "GET",
            data: {
                company_id:company_id,
                project_id:project_id,
                forum_id:forum_id
            },
            success: function (json) {
                var elem = $('#indicator-select');
                elem.empty(); //清空原有的
                var i_list = json.result.indicator_info_list;
                for (var index in i_list){
                    elem.append("<option value='"+i_list[index].indicator_id+"'>"+i_list[index].indicator_name+"</option>");  //添加一项option
                }
                elem.get(0).selectedIndex=0;  //设置Select索引值为1的项选中 
                $('#indicator-select').multiselect('rebuild');
    
            },
            error: function () {
                console.log('net error');
            }
        }); 
    
    }

    //页面加载完成拉取级联选择器的选项
    window.onload = function(){
        $.ajax({
            url:'/get_company_list',
            type: "GET",
            data: {},
            success: function (json) {
                var elem = $('#company-select');
                elem.empty(); //清空原有的
                var c_list = json.result.company_info_list;
                for (var index in c_list){
                    var c = c_list[index];
                    elem.append("<option value='"+c.company_id+"'>"+c.company_name+"</option>");  //添加一项option
                }
                elem.get(0).selectedIndex=0;  //设置Select索引值为1的项选中 
                $('#company-select').multiselect('rebuild');
                rebuild_project_select(elem.val());
    
            },
            error: function () {
                console.log('net error');
            }
        }); 

    }

    $(document).on('change', '#attachment-file-input', function() {
        var input = $(this);

        var files = input.get(0).files;
        // 对每个文件进行循环处理
        $('#data_attachment_list').empty();
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
        
          $('#data_attachment_list').append('<li>'+file.name+'</li>');
          // // 添加文件到formData
          // formData.append('photos[]', file, file.name);
        }
    });

    $('#post-i-data-btn').on('click',function(event){
        event.preventDefault();
        $('#excel-import-indicator-data .overlay').show();
        var formData = new FormData();
        var data_time = $('#i-data-datetimepicker').data('DateTimePicker').date().unix();
        var files = $('#attachment-file-input').get(0).files;
        for (var i=0 ;i < files.length;i++){
            var file = files[i]; 
            formData.append('file[]',file,file.name);
        }
        var data_value = null;
        if(root.indicator_property == 'boolean'){
            data_value=root.data_bool_value; 
        }else{
            data_value=root.data_value; 
        }
        formData.append('indicator_id',root.indicator_id);
        formData.append('project_id',root.project_id);
        formData.append('data_value',data_value);
        formData.append('data_time',data_time);
        $.ajax('/post_i_data_by_manual', {
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (json) {
                var r = config.parsebody(json,function(){
                    alert('上传成功!'); 
                });
            },
            error: function () {
            }
        }); 
    });
    function post_handler(e){
    
    }


})(this);

