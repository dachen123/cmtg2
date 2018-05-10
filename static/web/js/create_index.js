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
            indicator_desc:"",
            forum:"",
            forum_2:"",
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
            expect_bool_value:"1",
            compare_mode:"higher",
            compare_period:"none",
            errorband:"0",
            errorband_flag:"true",
            check_time_type:"date",
            delay_days:"0",
            level:"",
            check_time:"",
            compare_target:"expect_value",
            rule_start_index:1,
            rule_count:10,
            compute_indicator_expression:"",
            compute_i_expression:"",
            is_compute_indicator:"false",
            is_durative:"false",
            is_refer_indicator:'false',
            refer_to_id: '',
            indicator_map:{},
            indicator_map_reverse:{},
            alert_message:""
        },
        http:{
            emulateJSON: true,
            emulateHTTP: true
        },
        created:function(){
            // this.fetch_project_list()
            this.project_id = config.GetURLParameter('project_id');
            this.indicator_id = config.GetURLParameter('indicator_id');
            var _m = this;
            // if (this.indicator_id){
            if(this.indicator_id){
                $('h1#section-title').html('编辑指标')
                $('li#inherit_all_box_li').hide();
            }else{
                $('h1#section-title').html('添加指标')
                $('li#inherit_real_box_li').hide();
                $('li#set_indicator_rule_box_li').hide();

            }
            this.get_indicator_list_for_map(function(){
                if(_m.indicator_id){
                    _m.get_indicator_info();
                    _m.fetch_rule_list();
                }
            });
            // }

        },
        components:{
            IndicatorRuleItem,
        },
        watch:{
            forum:function(val){
                var text = $('#index-forum-select option[value="'+val+'"]').text();
                if (text == '资金安全性'){
                    $('#create-hint-p').show(); 
                }else{
                    $('#create-hint-p').hide(); 
                }

            },
            errorband_flag:function(val){
                if(val == 'true' || val == true){
                    $('#errorband-addon').hide(); 
                }else{
                
                    $('#errorband-addon').show(); 
                }
            
            },
            compare_target:function(value){
                var expect_input = document.getElementById('import-expect-value-region');
                var expect_bool_input = document.getElementById('import-expect-bool-value-region');
                var select_indicator = document.getElementById('filter-indicator-region');
                if(value == 'expect_value'){
                    if(this.indicator_property == 'boolean'){
                    
                        expect_bool_input.style.display='inline-block';
                    }else{
                        expect_input.style.display='inline-block';
                    }
                    select_indicator.style.display='none';
                }else{
                    expect_input.style.display='none';
                        expect_bool_input.style.display='none';
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
                    $('#import-expect-value-region').hide(); 
                    $('#import-expect-bool-value-region').show(); 
                }else{
                    $('#input-index-data-div').show(); 
                    $('#input-index-bool-data-div').hide(); 
                    $('#import-expect-value-region').show(); 
                    $('#import-expect-bool-value-region').hide(); 
                }
            },
            is_compute_indicator:function(val){
                if(val == 'true'){
                    $('#compute_indicator_region').show();
                }else{
                    $('#compute_indicator_region').hide();
                }
            },
            
        },
        methods:{
            redirect_to_unverify_data:function(){
                window.location.href = '/query_unverify_data?project_id='+this.project_id;
            },
            get_indicator_list_for_map:function(callback){
                var _m = this;
                this.$http.get('/get_indicator_list_by_condition',{
                    params:{
                        project_id:this.project_id
                    }
                }).then(function(r){
                    r = config.parsebody(r.body,function(result){
                        for(var index in result.indicator_info_list){
                            var indicator = result.indicator_info_list[index];
                            _m.indicator_map[indicator.indicator_name] = indicator.indicator_id;
                            _m.indicator_map_reverse[indicator.indicator_id.toString()] = indicator.indicator_name;
                        }
                        callback&&callback();
                    })
                })
            },
            check_post_data_is_not_null:function(){
                if(this.indicator_name.length == 0){
                    alert('请输入指标名');
                    return false;
                }else if(this.indicator_property.length == 0){
                    alert('请选择指标属性'); 
                    return false;
                }else if(this.forum.length == 0){
                    alert('请选择版块'); 
                    return false;
                }else if(this.collect_period.length == 0){
                    alert('请选择采集周期'); 
                    return false;
                }
                return true;
            },
            add_index: function(){
                if(!this.check_post_data_is_not_null()){
                    return;
                }
                var data = {
                    read_interface:this.read_interface,
                    indicator_name:this.indicator_name,
                    indicator_desc:this.indicator_desc,
                    indicator_property:this.indicator_property,
                    project_id:this.project_id,
                    forum:this.forum,
                    collect_period:this.collect_period,
                    is_compute_indicator:this.is_compute_indicator,
                    is_durative:this.is_durative

                }
                if(this.is_compute_indicator == 'true'){
                    data['compute_expression'] = this.compute_i_expression;
                }
                var illegal_c = this.indicator_name.search(/[^\u4e00-\u9fa5（），。\w]/gm);
                if (illegal_c >= 0){
                    var c =  this.indicator_name[illegal_c];
                    var msg = '指标名中存在非法字符"'+c+'"';
                    if ( c == ' ' || c == '　'){
                        msg += '，请检查输入是否有空白字符';
                    }
                    alert(msg);
                    return;
                }
                if(!/[\u4e00-\u9fa5a-zA-Z_]+[\u4e00-\u9fa5\w（），。]*/.test(this.indicator_name)){
                    alert("指标名的第一个字符不能为数字和括号等字符");
                    return;
                }
                this.$http.post('/create_indicator',data
                ).then(function(r){
                    console.log(r.body);
                    var _m = this;
                    var r = config.parsebody(r.body,function(result){
                        _m.indicator_id=result.indicator_info.indicator_id;
                        // localStorage.removeItem('sidebar_current_content');
                        window.location.href='/edit_indicator?project_id='+_m.project_id+'&indicator_id='+_m.indicator_id;
                    });
                }) 
            },
            add_refer_indicator:function(){
                var data = {
                    indicator_id : $('#indicator-select-2').val(),
                    project_id:this.project_id,
                    board_id:this.forum_2,
                }

                this.$http.post('/add_refer_indicator',data
                ).then(function(r){
                    console.log(r.body);
                    var _m = this;
                    var r = config.parsebody(r.body,function(result){
                        _m.indicator_id=result.indicator_info.indicator_id;
                        window.location.href='/edit_indicator?project_id='+_m.project_id+'&indicator_id='+_m.indicator_id;
                    });
                }) 
            },
            recalc_compute_indicator:function(){
                this.$http.post('/recalc_compute_indicator',{
                    indicator_id:this.indicator_id
                }).then(function(r){
                    var r = config.parsebody(r.body,function(result){
                        alert('操作成功，执行计算将花费一段时间');
                    });
                }) 
            },
            post_data:function(){
                if(this.is_compute_indicator == 'true'){
                    if(!this.check_compute_indicator_expression()){
                        return;
                    }
                }
                if (this.indicator_id){
                    this.update_indicator();
                
                }
                else{
                    this.add_index(); 
                }
            },
            post_refer_indicator:function(){
                if(this.indicator_id){
                    this.update_refer_indicator()
                }else{
                    this.add_refer_indicator();
                }
            },
            update_indicator:function(){
                var data = {
                    indicator_id:this.indicator_id,
                    read_interface:this.read_interface,
                    indicator_name:this.indicator_name,
                    indicator_desc:this.indicator_desc,
                    indicator_property:this.indicator_property,
                    project_id:this.project_id,
                    forum:this.forum,
                    collect_period:this.collect_period,
                    is_compute_indicator:this.is_compute_indicator,
                    is_durative:this.is_durative
                }
                if(this.is_compute_indicator == 'true'){
                    data['compute_expression'] = this.compute_i_expression;
                }
                var illegal_c = this.indicator_name.search(/[^\u4e00-\u9fa5（），。\w]/gm);
                if (illegal_c >= 0){
                    var c =  this.indicator_name[illegal_c];
                    var msg = '指标名中存在非法字符"'+c+'"';
                    if ( c == ' ' || c == '　'){
                        msg += '，请检查输入是否有空白字符';
                    }
                    alert(msg);
                    return;
                }
                if(!/[\u4e00-\u9fa5a-zA-Z_]+[\u4e00-\u9fa5\w，。（）]*/.test(this.indicator_name)){
                    alert("指标名的第一个字符不能为数字和括号等字符");
                    return;
                }
                this.$http.post('/update_indicator',data
                ).then(function(r){
                    console.log(r.body);
                    // this.indicator_id=r.body.result.indicator_info.indicator_id;
                    // window.location.href='/edit_indicator?project_id='+this.project_id+'&indicator_id='+this.indicator_id;
                    // localStorage.removeItem('sidebar_current_content');
                    var indicator_info = r.body.result.indicator_info;
                    this.read_interface=indicator_info.read_interface;
                    this.indicator_name=indicator_info.indicator_name;
                    this.indicator_desc=indicator_info.description;
                    this.indicator_property=indicator_info.indicator_property;
                    this.forum=indicator_info.forum.board_id;
                    this.collect_period=indicator_info.collect_period;
                    alert('修改成功');

                }) 
            
            },
            update_refer_indicator:function(){
                var data = {
                    indicator_id:this.indicator_id,
                    refer_to_id:$('#indicator-select-2').val(),
                    board_id:this.forum_2,
                }
                this.$http.post('/update_refer_indicator',data
                ).then(function(r){
                    console.log(r.body);
                    var _m = this;
                    var r = config.parsebody(r.body,function(result){
                        _m.indicator_id=result.indicator_info.indicator_id;
                        window.location.href='/edit_indicator?project_id='+_m.project_id+'&indicator_id='+_m.indicator_id;
                    });
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
                indicator_select.multiselect('refresh');

                project_select.empty(); //清空原有的
                var p_list = data.project_list;
                for (var index in p_list){
                    project_select.append("<option value='"+p_list[index].project_id+"'>"+p_list[index].project_name+"</option>");  //添加一项option
                }
                project_select.val(data.project.project_id);
                project_select.multiselect('refresh');

                board_select.empty();//清空原有的
                var b_list = data.board_list;
                for (var index in b_list){
                    board_select.append("<option value='"+b_list[index].board_id+"'>"+b_list[index].name+"</option>");  //添加一项option
                }
                board_select.val(data.board.board_id);
                board_select.multiselect('refresh');

            },
            set_refer_indicator_cascader_select_val:function(data){
                var indicator_select = $('#indicator-select-2');
                var company_select = $('#company-select-2');
                var project_select = $('#project-select-2');
                var board_select = $('#board-select-2');

                company_select.empty();
                var c_list = data.company_list;
                for (var index in c_list){
                    var c = c_list[index];
                    company_select.append("<option value='"+c.company_id+"'>"+c.company_name+"</option>");  //添加一项option
                }
                company_select.val(data.company.company_id);
                company_select.multiselect('rebuild');

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
                board_select.multiselect('rebuild');

            },
            get_indicator_info:function(){
                var _m = this;
                this.$http.get('/get_indicator_info',{
                    params:{
                        indicator_id:this.indicator_id
                    }
                }).then(function(res){
                    var indicator_info = res.body.result.indicator_info;
                    this.read_interface=indicator_info.read_interface;
                    this.indicator_name=indicator_info.indicator_name,
                    this.indicator_desc=indicator_info.description;
                    this.indicator_property=indicator_info.indicator_property,
                    this.forum=indicator_info.forum.board_id,
                    this.forum_2=indicator_info.forum.board_id,
                    this.collect_period=indicator_info.collect_period,
                    this.is_compute_indicator=indicator_info.is_compute_indicator,
                    this.set_expression_to_unicode(indicator_info.compute_expression);
                    this.is_durative=indicator_info.is_durative;
                    this.is_refer_indicator = indicator_info.is_refer_indicator;
                    this.refer_to_id = indicator_info.refer_to_id;
                    if(indicator_info.is_refer_indicator == 'true'){
                        $('#create_index_box').hide();
                        $('#create_index_box_li').hide();
                        $('#create_refer_indicator_box').show();
                        $('#create_refer_indicator_box_li').show();
                        _m.get_refer_indicator_cascader_select_val(this.refer_to_id);
                    }else{
                        $('#create_index_box').show();
                        $('#create_index_box_li').show();
                        $('#create_refer_indicator_box').hide();
                        $('#create_refer_indicator_box_li').hide();
                    }
                });
            
            },
            set_expression_to_unicode:function(e){
                if(e && !(e.length == 0)){
                    var i_id_list = e.match(/i\d+/g);
                    var a_id_list = e.match(/a\d+/g);
                    for( var index in i_id_list){
                        var i_id_str = i_id_list[index].replace(/i/g,'');
                        var i_name = this.indicator_map_reverse[i_id_str];
                        e = e.replace(eval('/'+i_id_list[index]+'/'),i_name);
                    }
                    for(var index in a_id_list){
                        var a_id_str = a_id_list[index].replace(/a/g,'');
                        var a_name = this.indicator_map_reverse[a_id_str];
                        e = e.replace(eval('/'+a_id_list[index]+'/'),a_name+'年初余额');
                    
                    }
                }
                this.compute_indicator_expression = e;

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
            show_del_rule_by_date_box:function(){
                $('#del-rule-div').show();
            },
            cancel_del:function(){
                $('#del-rule-div').hide(); 
            },
            cancel_op:function(){
                $('.table-add-item').hide();
            },
            post_rule_data:function(){
                var check_time = $('#rule-datetimepicker').data('DateTimePicker').date().unix(); 
                var expect = "";
                if (this.indicator_property == 'boolean'){
                    expect = this.expect_bool_value;
                }else{
                    expect = this.expect_value;
                }
                var errorband = '0';
                if (this.errorband_flag == 'true'){
                    errorband = this.errorband; 
                }else{
                    errorband = parseFloat(this.errorband)/100; 
                }
                var data = {
                        indicator_id:this.indicator_id,
                        expect_value:expect,
                        compare_mode:this.compare_mode,
                        statistic_style:this.statistic_style,
                        compare_target:this.compare_target,
                        compare_period:this.compare_period,
                        message:this.alert_message,
                        errorband:errorband,
                        errorband_flag:this.errorband_flag,
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
            get_refer_indicator_cascader_select_val:function(indicator_id){
                this.$http.get('/get_rule_cascader_select_val',{params:{
                    indicator_id:indicator_id
                }})
                    .then(function(res){
                        console.log(res.body);
                        var r = config.parsebody(res.body);
                        if(r){
                            this.set_refer_indicator_cascader_select_val(res.body.result);
                        }
                    }) 
            },
            get_indicator_cascader_select_val:function(indicator_id){
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
                if(this.indicator_property == 'boolean'){
                    this.expect_bool_value = rule_info.expect;
                }else{
                    this.expect_value = rule_info.expect;
                }
                this.expect_value = rule_info.expect;
                this.compare_target = rule_info.compare_target;
                this.compare_period = rule_info.repeat_period;

                this.errorband_flag = rule_info.errorband_flag;
                if(this.errorband_flag == 'true' || this.errorband_flag  == true){
                    this.errorband = rule_info.errorband;
                }else{
                    this.errorband = rule_info.errorband*100;
                }
                this.compare_mode = rule_info.compare_mode;
                this.delay_days = rule_info.delay_days;
                this.alert_message = rule_info.message;
                if (this.compare_target == 'indicator'){
                    this.get_indicator_cascader_select_val(rule_info.related_indicator_id);
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
                if(!confirm('确认删除规则？')){
                    return;
                }
                this.$http.post('/delete_rule',{
                    rule_id: rule.rule_id
                })
                    .then(function(res){
                        this.fetch_rule_list()
                    }) 
            
            },
            del_rule_by_date_range:function(){
                if(!confirm('确认删除?')){
                    return;
                }
                var data={
                    project_id:this.project_id,
                    begin_time:startDate(),
                    end_time:endDate()
                }
                this.$http.post('/del_rule_in_date_range',data
                )
                    .then(function(res){
                        var _m = this;
                        var r = config.parsebody(res.body,function(result){
                            alert('删除成功');
                            _m.fetch_rule_list();
                            _m.cancel_del();
                        })
                    }) 
            
            },
            check_compute_indicator_expression:function(){
                var expression = this.compute_indicator_expression.replace(/\s+/g,'');
                console.log(expression);
                //var i_name_list = expression.match(/[^.,<>+\-*/()[\]{}^&|%0-9]+/g);
                var i_name_list = expression.match(/[\u4e00-\u9fa5a-zA-Z]+[\u4e00-\u9fa5\w]*([\(\（][\u4e00-\u9fa5\w，。]+[\)\）])*[\u4e00-\u9fa5\w]*/gm);
                console.log(i_name_list);
                for (var index in i_name_list){
                    var i_name = i_name_list[index]; 
                    var i_id = this.indicator_map[i_name];
                    if(i_id){
                        var p_i_name = i_name.replace(/([\(\（\）\)])/g,"\\$1");
                        expression = expression.replace(eval("/[\u4e00-\u9fa5a-zA-Z_]?"+p_i_name+"[\u4e00-\u9fa5，。\w]?/g"),function($1){
                                if($1==i_name){
                                    return 'i'+i_id;
                                }else{
                                    return $1; 
                                }
                        });
                    }else if( i_name.search('年初余额') > 0){
                        var sub_i_name = i_name.replace('年初余额','');
                        i_id = this.indicator_map[sub_i_name];
                        if(!i_id){
                            alert('找不到指标名'+i_name);
                            return false;
                        }
                        var p_i_name = i_name.replace(/([\(\（\）\)])/g,"\\$1");
                        expression = expression.replace(eval("/[\u4e00-\u9fa5a-zA-Z_]?"+p_i_name+"[\u4e00-\u9fa5，。\w]?/g"),function($1){
                                if($1 == i_name){

                                    return 'a'+i_id;
                                }else{
                                    return i_name; 
                                }
                            });
                        
                    }else{
                        alert('找不到指标名'+i_name);
                        return false;
                    }
                }
                this.compute_i_expression = expression;
                console.log(this.compute_i_expression);
                return true;
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

        $('#company-select-2').multiselect({
            includeSelectAllOption: false,
            enableFiltering: true,
            nonSelectedText: '请选择公司',
            numberDisplayed: 10,
            selectAllText: '全选',
            allSelectedText: '已选择所',
            onChange:function(option,checked,select){
                var company_id = option.val();
                rebuild_project_select_2(company_id);
            
            }
    
        });
        $('#project-select-2').multiselect({
            includeSelectAllOption: false,
            enableFiltering: true,
            nonSelectedText: '请选择项目',
            numberDisplayed: 10,
            allSelectedText: '已选择所有人',
            onChange:function(option,checked,select){
                console.log(option+','+checked+','+select);
                var company_id = $('#company-select-2').val();
                var project_id = option.val()
                var forum_id = $('#board-select-2').val();
                rebuild_board_select_2(project_id);
                 
            }
    
    
        });
        $('#board-select-2').multiselect({
            includeSelectAllOption: false,
            enableFiltering: true,
            nonSelectedText: '请选择版块',
            numberDisplayed: 10,
            allSelectedText: '已选择所有人',
            onChange:function(option,checked,select){
                var company_id = $('#company-select-2').val();
                var project_id = $('#project-select-2').val()
                var forum_id = option.val();
                rebuild_indicator_select_2(company_id,project_id,forum_id);
            
            }
    
        });
        $('#indicator-select-2').multiselect({
            includeSelectAllOption: true,
            enableFiltering: true,
            nonSelectedText: '请选择指标',
            numberDisplayed: 10,
            selectAllText: '全选',
            allSelectedText: '已选择所有指标'
    
        });

        // if(root.indicator_id && root.is_refer_indicator=='true'){
        //     root.get_refer_indicator_cascader_select_val(root.indicator_id);
        // }
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
                if(elem.length > 0){
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
                }
    
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
                if(elem.length > 0){
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
                }

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
                if(elem.length > 0){
                    elem.empty(); //清空原有的
                    var i_list = json.result.indicator_info_list;
                    for (var index in i_list){
                        elem.append("<option value='"+i_list[index].indicator_id+"'>"+i_list[index].indicator_name+"</option>");  //添加一项option
                    }
                    elem.get(0).selectedIndex=0;  //设置Select索引值为1的项选中 
                    $('#indicator-select').multiselect('rebuild');
                }
    
            },
            error: function () {
                console.log('net error');
            }
        }); 
    
    }
    //project select rebulid
    function rebuild_project_select_2(company_id){
        //调用接口获取新值
        $.ajax({
            type: "GET",
            url:'/get_company_all_project',
            data: {
                company_id:company_id
            },
            success: function (json) {
                var elem = $("#project-select-2");
                if(elem.length > 0){
                    elem.empty(); //清空原有的
                    var p_list = json.result.project_info_list;
                    for (var index in p_list){
                        elem.append("<option value='"+p_list[index].project_id+"'>"+p_list[index].project_name+"</option>");  //添加一项option
                    }
                    elem.get(0).selectedIndex=0;  //设置Select索引值为1的项选中 
                    $('#project-select-2').multiselect('rebuild');
                    // var forum_id = $("#board-select-2").val();
                    var project_id = elem.val();
                    //rebuild_indicator_select_2(company_id,project_id,forum_id);
                    rebuild_board_select_2(project_id);
                }
    
            },
            error: function () {
                console.log('net error');
            }
        }); 
    
    }
    //board select
    function rebuild_board_select_2(project_id){
        //调用接口获取新值
        $.ajax({
            type: "GET",
            url:'/get_project_all_board',
            data: {
                project_id:project_id
            },
            success: function (json) {
                var elem = $("#board-select-2");
                if(elem.length > 0){
                    elem.empty(); //清空原有的
                    var b_list = json.result.board_info_list;
                    for (var index in b_list){
                        elem.append("<option value='"+b_list[index].board_id+"'>"+b_list[index].name+"</option>");  //添加一项option
                    }
                    elem.get(0).selectedIndex=0;  //设置Select索引值为1的项选中 
                    $('#board-select-2').multiselect('rebuild');
                    var forum_id = elem.val();
                    var project_id = $('#project-select-2').val();
                    var company_id = $('#company-select-2').val();
                    rebuild_indicator_select_2(company_id,project_id,forum_id);
                }

            },
            error: function () {
                console.log('net error');
            }
        }); 

    }
    
    function rebuild_indicator_select_2(company_id,project_id,forum_id){
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
                var elem = $('#indicator-select-2');
                if(elem.length > 0){
                    elem.empty(); //清空原有的
                    var i_list = json.result.indicator_info_list;
                    for (var index in i_list){
                        elem.append("<option value='"+i_list[index].indicator_id+"'>"+i_list[index].indicator_name+"</option>");  //添加一项option
                    }
                    elem.get(0).selectedIndex=0;  //设置Select索引值为1的项选中 
                    $('#indicator-select-2').multiselect('rebuild');
                }
    
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
                var elem_2 = $('#company-select-2');
                if(elem.length > 0){
                    elem.empty(); //清空原有的
                    var c_list = json.result.company_info_list;
                    for (var index in c_list){
                        var c = c_list[index];
                        elem.append("<option value='"+c.company_id+"'>"+c.company_name+"</option>");  //添加一项option
                        // elem_2.append("<option value='"+c.company_id+"'>"+c.company_name+"</option>");  //添加一项option
                    }
                    elem.get(0).selectedIndex=0;  //设置Select索引值为1的项选中 
                    $('#company-select').multiselect('rebuild');
                    rebuild_project_select(elem.val());

                    // elem_2.get(0).selectedIndex=0;  //设置Select索引值为1的项选中 
                    // $('#company-select-2').multiselect('rebuild');
                    // rebuild_project_select_2(elem_2.val());
                }
                //if(elem_2.find('option').length <= 0 ){
                if(!config.GetURLParameter('indicator_id')){
                    elem_2.empty();
                    var c_list = json.result.company_info_list;
                    for (var index in c_list){
                        var c = c_list[index];
                        elem_2.append("<option value='"+c.company_id+"'>"+c.company_name+"</option>");  //添加一项option
                    }
                    elem_2.get(0).selectedIndex=0;  //设置Select索引值为1的项选中 
                    $('#company-select-2').multiselect('rebuild');
                    rebuild_project_select_2(elem_2.val());
                }
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

    // var startDate = moment().local().format('MM/DD/YYYY');
    // var endDate = moment().local().add( moment.duration(1,'months'));
    // var endDate = endDate.format('MM/DD/YYYY');
    //  
    // $('#inputDateRange').daterangepicker({
    //     "showDropdowns": true,
    //     "autoApply": true,
    //     "locale": {
    //         "format": "MM/DD/YYYY",
    //         "separator": " - ",
    //         "applyLabel": "确定",
    //         "cancelLabel": "取消",
    //         "fromLabel": "从",
    //         "toLabel": "到",
    //         "customRangeLabel": "Custom",
    //         "weekLabel": "W",
    //         "daysOfWeek": [
    //             "日",
    //             "一",
    //             "二",
    //             "三",
    //             "四",
    //             "五",
    //             "六"
    //         ],
    //         "monthNames": [
    //             "一月",
    //             "二月",
    //             "三月",
    //             "四月",
    //             "五月",
    //             "六月",
    //             "七月",
    //             "八月",
    //             "九月",
    //             "十月",
    //             "十一月",
    //             "十二月"
    //         ],
    //         "firstDay": 1
    //     },
    //     "startDate": startDate,
    //     "endDate": endDate
    // }, function(start, end, label) {
    //     // console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
    //     startDate = start.format('MM/DD/YYYY');
    //     endDate = end.format('MM/DD/YYYY');
    // });

    var default_time = moment().local().hours(0).minutes(0).seconds(0);
    var end_time = moment().local().hours(0).minutes(0).seconds(0).add( moment.duration(1,'months'));

    $('#start-time-picker').datetimepicker({
        locale: 'zh-cn',
        format: 'MM/DD/YYYY',
        allowInputToggle:true,
        widgetPositioning:{
            horizontal: 'left',
            vertical: 'bottom'
        },
        defaultDate:default_time
    });

    $('#end-time-picker').datetimepicker({
        locale: 'zh-cn',
        format: 'MM/DD/YYYY',
        minDate:default_time,
        allowInputToggle:true,
        widgetPositioning:{
            horizontal: 'left',
            vertical: 'bottom'
        },
        defaultDate:end_time
    });

    $('#start-time-picker').on('dp.change',function(e){
        var minDate = $('#start-time-picker').data('DateTimePicker').date();
        $('#end-time-picker').data('DateTimePicker').minDate(minDate);

    });


    function startDate(){
        return $('#start-time-picker').data('DateTimePicker').date().format('MM/DD/YYYY');
    
    }

    function endDate(){
        return $('#end-time-picker').data('DateTimePicker').date().format('MM/DD/YYYY');
    
    }




})(this);

