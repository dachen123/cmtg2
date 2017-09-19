import Vue from 'vue/dist/vue.js'
import VueResource from 'vue-resource';
Vue.use(VueResource);


import { config } from './common.js'
import IndicatorItem from '../components/upload_indicator_item.vue'

(function(global){


    // Vue.component('urgent-indicator-item',
    //         HomeUrgentIndicator);
    // Vue.component('company-item',
    //         HomeCompanyItem);
    var root = new Vue({
             
        el:'#hty-upload-excel',
        data:{
            indicator_list:[],
            project_id:"",
            board_id:null,
            board_list:[],
            data_upload_message:'上传成功'
        },
        http:{
            emulateJSON: true,
            emulateHTTP: true
        },
        created:function(){
            this.project_id = config.GetURLParameter('project_id');
            this.board_id = config.GetURLParameter('board_id');
            this.$http.get('/get_board_list',{
                params:{project_id:this.project_id}
            })
            .then(function(res){
                this.board_list = res.body.result.board_list
            }) 

        },
        components:{
            IndicatorItem
        },
        watch:{
        },
        methods:{
            set_indicator_list:function(data){
                this.indicator_list = data.indicator_list; 
            },
            item_has_null:function(item){
                if($.AdminLTE.utils.isNull(item.item.indicator_property)){
                    alert('请选择指标 "'+item.item.indicator_name+'" 的指标属性！');
                    return true;
                }else if($.AdminLTE.utils.isNull(item.board)){
                    alert('请选择指标 "'+item.item.indicator_name+'" 的所属版块！');
                    return true;
                }else if($.AdminLTE.utils.isNull(item.item.collect_period)){
                    alert('请选择指标 "'+item.item.indicator_name+'" 的采集周期！');
                    return true;
                }else{
                    return false;
                } 
            },
            batch_import_indicator:function(){
                var child_list = this.$refs;
                var indicator_list = [];
                for( var index in child_list.index){
                    var i = child_list.index[index]; 
                    if(this.item_has_null(i)){
                        return;
                    };
                    var i_d = {
                        'indicator_name':i.item.indicator_name,
                        'indicator_property':i.item.indicator_property,
                        'project_id':this.project_id,
                        'board':i.board,
                        'collect_period':i.item.collect_period
                    }
                    indicator_list.push(i_d);
                }
                $('#excel-import-indicator .overlay').show();
                this.$http.post('/batch_import_indicator',{
                    indicator_list:JSON.stringify(indicator_list)
                })
                    .then(function(r){
                        if (r.body.error_code == 'OK'){
                            alert('创建指标成功!');
                        }
                        else{
                            alert(JSON.stringify(r.body.message));
                        }
                        $('#excel-import-indicator .overlay').hide();
                        window.location.href=window.location.href;
                    })
            }
        }
        
    });
    window.root=root;

    $(document).on('change', '#indicator-excel-file-input', function() {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        if(!input.get(0).files.length > 0){
            alert('请先选择需要解析的文件');
            return;
        }
        $('#excel-import-indicator .overlay').show();
        $('#indicator-excel-name').val(label);
        var indicator_position = $('#indicator-name-position').val();
        var sheet_name_str = $('#sheet-name-input').val();
        var sheet_title_num = $('#sheet-title-num').val();
        var formData = new FormData();
        
        formData.append('file', input.get(0).files[0]);
        formData.append('project_id', root.project_id);
        formData.append('indicator_position', indicator_position);
        formData.append('sheet_name', sheet_name_str);
        //formData.append('sheet_names', JSON.stringify(sheet_name_list));
        formData.append('title_lines', sheet_title_num);

        $.ajax('/parse_excel_indicator', {
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (json) {
                var r = config.parsebody(json,function(result){
                    input.val('');
                    root.set_indicator_list(result);
                });
                input.val('');
                $('#indicator-excel-name').val('');
                $('#excel-import-indicator .overlay').hide();
            },
            error: function () {
                $('#excel-import-indicator .overlay').hide();
                window.location.href=window.location.href;
            }
        }); 

    });

    //导入指标数据部分
    var default_time = moment().local().hours(0).minutes(0).seconds(0);

    $('#i-data-datetimepicker').datetimepicker({
        locale: 'zh-cn',
        format: 'MM/DD/YYYY',
        allowInputToggle:true,
        widgetPositioning:{
            horizontal: 'left',
            vertical: 'bottom'
        },
        defaultDate:default_time
    });
    
    $(document).on('change', '#i-data-excel-file-input', function() {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        $('#indicator-data-excel-name').val(label);


    });
    $('#upload-indicator-data-btn').on('click',function(){
        if( !confirm('确认提交?')){
            return; 
        }
        var input = $('#i-data-excel-file-input'); 
        if(!input.get(0).files.length > 0){
            alert('请先选择需要上传的文件');
            return;
        }
        $('#excel-import-indicator-data .overlay').show();
        var formData = new FormData();
        var data_time = $('#i-data-datetimepicker').data('DateTimePicker').date().unix();
        var sheet_num = $('#upload_sheet_num').val();
        var sheet_name_str = $('#data-sheet-name-input').val();
        var s_name_list = sheet_name_str.split(/；|;/);
        var sheet_name_list =[];
        for (var index in s_name_list){
            if (s_name_list[index] !=""){
                sheet_name_list.push(s_name_list[index]);
            }
        }
        var sheet_title_num = $('#data-sheet-title-num').val();
        var indicator_position = $('#i-name-position').val();
        
        formData.append('file', input.get(0).files[0]);
        formData.append('project_id', root.project_id);
        formData.append('data_time', data_time);
        formData.append('sheet_num', sheet_num);
        formData.append('sheet_name', JSON.stringify(sheet_name_list));
        formData.append('title_lines', sheet_title_num);
        formData.append('indicator_position', indicator_position);

        $.ajax('/parse_excel_indicator_data', {
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (json) {
                var r = config.parsebody(json,function(){
                    alert('导入成功!'); 
                });
                $('#excel-import-indicator-data .overlay').hide();
                window.location.href=window.location.href;
            },
            error: function () {
                alert('网络错误，请重试');
                $('#excel-import-indicator-data .overlay').hide();
                window.location.href=window.location.href;
            }
        }); 
    });

    //导入指标预期值
    $(document).on('change', '#indicator-expect-excel-file-input', function() {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        $('#indicator-expect-excel-name').val(label);


    });

    $('#upload-indicator-expect-excel-btn').on('click',function(){
        if( !confirm('确认提交?')){
            return; 
        }
        $('#excel-import-expects .overlay').show();
        var input = $('#indicator-expect-excel-file-input'); 
        if(!input.get(0).files.length > 0){
            alert('请先选择需要上传的文件');
            $('#excel-import-expects .overlay').hide();
            return;
        }
        var formData = new FormData();

        var sheet_name_str = $('#expect-sheet-name-input').val();
        var sheet_name_list = sheet_name_str.split(/；|;/);
        // if(sheet_name_list.length <= 0){
        //     sheet_name_list = sheet_name_str.split(';');
        // }
        var sheet_title_num = $('#expect-sheet-title-num').val();

        var errorband = $('#expect-errorband-input').val();
        var delay_days = $('#expect-rule-delay-input').val();

        var indicator_position = $('#expect-indicator-name-position').val();
        
        formData.append('file', input.get(0).files[0]);
        formData.append('project_id', root.project_id);
        formData.append('sheet_names', JSON.stringify(sheet_name_list));
        formData.append('title_lines', sheet_title_num);
        formData.append('errorband', parseFloat(errorband)/100);
        formData.append('delay_days', delay_days);
        formData.append('indicator_position', indicator_position);

        $.ajax('/parse_excel_indicator_expect', {
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (json) {
                var r = config.parsebody(json,function(){
                    alert('导入成功!'); 
                });
                $('#excel-import-expects .overlay').hide();
                window.location.href=window.location.href;
            },
            error: function () {
                alert('网络错误，请重试');
                $('#excel-import-expects .overlay').hide();
                window.location.href=window.location.href;
            }
        }); 
    });

    //勾稽关系预检查
    $('#precheck-gouji-btn').on('click',function(){
        $('#excel-import-indicator-data .overlay').show();
        var data_time = $('#i-data-datetimepicker').data('DateTimePicker').date().unix();
        var project_id = root.project_id;

        $.ajax({
            type: "POST",
            url:'/precheck_gouji_rules',
            data: {
                project_id:project_id,
                data_time:data_time
            },
            success: function (json) {
                var r = config.parsebody(json,function(result){
                    var modal= $('#precheck-result-modal');
                    modal.find('#precheck-result-list-ul').empty();
                    for (var index in result.messages){
                         modal.find('#precheck-result-list-ul').append('<li>'
                                +result.messages[index]+'</li>');
                    }
                    modal.modal('show');
                });
                $('#excel-import-indicator-data .overlay').hide();
            },
            error: function () {
                alert('网络错误，请重试');
                $('#excel-import-indicator-data .overlay').hide();
            }
        }); 

        
    });


    //银行流水数据导入
   //多选初始化 
    $('#indicator-select').multiselect({
        includeSelectAllOption: true,
        enableFiltering: true,
        buttonWidth: '100%',
        nonSelectedText: '请选择指标',
        numberDisplayed: 10,
        selectAllText: '全选',
        allSelectedText: '已选择所有指标'

    });
    //日期选择控件初始化
    $('#bank-data-datetimepicker').datetimepicker({
        locale: 'zh-cn',
        format: 'MM/DD/YYYY',
        allowInputToggle:true,
        widgetPositioning:{
            horizontal: 'left',
            vertical: 'bottom'
        },
        defaultDate:default_time
    });
    $(document).on('change', '#bank-data-excel-file-input', function() {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        $('#bank-data-excel-name').val(label);

    });
    //调用接口获取指标列表
    $.ajax({
        url:'/get_indicator_list_by_condition',
        type: "GET",
        data: {
            project_id:root.project_id,
            forum_id:root.board_id
        },
        success: function (json) {
            var elem = $('#indicator-select');
            //判断元素是否存在
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
            console.log('网络出错!');
        }
    }); 

    $('#upload-bank-data-btn').on('click',function(){
        if( !confirm('确认提交?')){
            return; 
        }
        var input = $('#bank-data-excel-file-input'); 
        if(!input.get(0).files.length > 0){
            alert('请先选择需要上传的文件');
            return;
        }
        $('#excel-import-bank-statement .overlay').show();
        var formData = new FormData();
        var data_time = $('#bank-data-datetimepicker').data('DateTimePicker').date().format('MM/DD/YYYY');
        var indicator_id = $('#indicator-select').val();
        var bankname = $('#bank-name-input').val();
        
        formData.append('file', input.get(0).files[0]);
        formData.append('project_id', root.project_id);
        formData.append('bankname',bankname);
        formData.append('data_time', data_time);
        formData.append('indicator_id', indicator_id);

        $.ajax('/import_bank_statement', {
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (json) {
                var r = config.parsebody(json,function(){
                    alert('导入成功,您可以联系审核人审核上传数据!'); 
                });
                $('#excel-import-bank-statement .overlay').hide();
                window.location.href=window.location.href;
            },
            error: function () {
                alert('网络错误，请重试');
                $('#excel-import-bank-statement .overlay').hide();
                window.location.href=window.location.href;
            }
        }); 
    });

})(this);

