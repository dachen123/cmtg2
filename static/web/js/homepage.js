import Vue from 'vue/dist/vue.js'
import VueResource from 'vue-resource';
Vue.use(VueResource);

// import lineChart from '../components/lineChart/lineChart.js'

import { config } from './common.js'
import HomeUrgentIndicator from '../components/home_urgent_indicator.vue'
import HomeCompanyItem from '../components/home_company_item.vue'
import HomeTmAeventItem from '../components/home_tm_aevent.vue'
import HomeFmAeventItem from '../components/home_fm_aevent.vue'
import HomeLpmItem from '../components/home_latest_pm.vue'

(function(global){


    // Vue.component('urgent-indicator-item',
    //         HomeUrgentIndicator);
    // Vue.component('company-item',
    //         HomeCompanyItem);
    var root = new Vue({
             
        el:'#hty-home-component',
        data:{
            urgent_indicator_list:[] ,
            company_info_list:[],
            to_me_aevents:[],
            from_me_aevents:[],
            project_info_list:[],
            to_me_aevent_id:'',
            indicator_start_index:1,
            indicator_count:12
        },
        http:{
            emulateJSON: true,
            emulateHTTP: true
        },
        created:function(){
            this.fetch_urgent_indicator()
            this.fetch_company_list()
            this.fetch_to_me_verify_aevent()
            this.fetch_from_me_verify_aevent()
            this.fetch_my_project_list()
        },
        components:{
            HomeUrgentIndicator,
            HomeCompanyItem,
            HomeTmAeventItem,
            HomeFmAeventItem,
            HomeLpmItem
        },
        methods:{
            fetch_urgent_indicator:function(){
                this.$http.get('/get_unsolved_indicator',{
                    params:{
                        start_index:this.indicator_start_index,
                        count:this.indicator_count
                    
                    }
                })
                    .then(function(res){
                        this.urgent_indicator_list = res.body.result.indicator_info_list
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
                this.$http.get('/get_unsolved_indicator',{
                    params:{
                        start_index:this.indicator_start_index,
                        count:this.indicator_count
                    }
                })
                    .then(function(res){
                        var r = config.parsebody(res.body);
                        if(r){
                            this.urgent_indicator_list = res.body.result.indicator_info_list
                        }
                    }) 

            },
            next_page_indicator:function(){
                var next_page_start = this.indicator_start_index + this.indicator_count;
                this.$http.get('/get_unsolved_indicator',{
                    params:{
                        start_index:next_page_start,
                        count:this.indicator_count
                    }
                })
                    .then(function(res){
                        var r = config.parsebody(res.body);
                        if(r){
                            var indicator_list = res.body.result.indicator_info_list;
                            if(indicator_list.length > 0){
                                this.urgent_indicator_list = indicator_list;
                                this.indicator_start_index = next_page_start;
                            }
                            else{
                            
                                alert('没有更多的数据了');
                            }
                        }
                    }) 
            },
            fetch_company_list:function(){
                this.$http.get('/get_company_list',{})
                    .then(function(res){
                        this.company_info_list = res.body.result.company_info_list
                    }) 
            },
            fetch_my_project_list:function(){
                this.$http.get('/get_my_project_list',{})
                    .then(function(res){
                        this.project_info_list = res.body.result.project_info_list.slice(0,5);
                    }) 
            },
            fetch_to_me_verify_aevent:function(){
                this.$http.get('/get_to_me_verify_aevent',{
                    params:{
                        start_index:1,
                        count:-1
                    }
                })
                    .then(function(res){
                        this.to_me_aevents = res.body.result.aevent_info_list
                    }) 
            },
            fetch_from_me_verify_aevent:function(){
                this.$http.get('/get_from_me_verify_aevent',{
                    params:{
                        start_index:1,
                        count:-1
                    }
                })
                    .then(function(res){
                        this.from_me_aevents = res.body.result.aevent_info_list
                    }) 
            },
            del_company:function(company){
                if (!confirm('确认删除公司?')){
                    return;
                }
                this.$http.post('/delete_company',{
                    company_id: company.company_id
                })
                    .then(function(res){
                        var _m = this;
                        var r = config.parsebody(res.body,function(result){
                            _m.fetch_company_list()
                        })
                    }) 
            
            },
            verify_aevent:function(aevent){
                // this.$http.post('/solve_aevent',{
                //     aevent_id: aevent.aevent_id,
                //     flag    :flag
                // })
                //     .then(function(res){
                //         var _m = this;
                //         var r = config.parsebody(res.body,function(result){
                //             _m.fetch_to_me_verify_aevent()
                //         })
                //     }) 
                this.to_me_aevent_id = aevent.aevent_id;
            },
            audit_aevent:function(flag){
                this.$http.post('/solve_aevent',{
                    aevent_id: this.to_me_aevent_id,
                    handling_msg:$('#audit-opinion').val(),
                    flag    :flag
                })
                    .then(function(res){
                        var _m = this;
                        var r = config.parsebody(res.body,function(result){
                            $('#audit-modal').modal('hide');
                            _m.fetch_to_me_verify_aevent();
                        })
                    }) 
            }
        }
        
    });

    window.root=root;

    var data_verify_table = $("#data-verify-table").DataTable({
        language:{
            "decimal":        "",
            "emptyTable":     "没有可用的数据",
            "info":           "显示 _TOTAL_ 行中的 _START_ 到 _END_ 行",
            "infoEmpty":      "共 0 行",
            "infoFiltered":   "(filtered from _MAX_ total entries)",
            "infoPostFix":    "",
            "thousands":      ",",
            "lengthMenu":     "显示 _MENU_ 行",
            "loadingRecords": "Loading...",
            "processing":     "Processing...",
            "search":         "搜索:",
            "zeroRecords":    "找不到匹配的记录",
            "paginate": {
                "first":      "第一页",
                "last":       "最后一页",
                "next":       "下一页",
                "previous":   "上一页"
            },
            "aria": {
                "sortAscending":  ": activate to sort column ascending",
                "sortDescending": ": activate to sort column descending"
            }  
        }, 
        initComplete: function () {
            this.api().columns().eq(0).each( function ( index ) {
                if (index > 0){
                    var column = this.column( index );
                    var select = $('<select class="form-control input-sm"><option value=""></option></select>')
                        .appendTo( $(column.footer()).empty() )
                        .on( 'change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );

                            column
                                .search( val ? '^'+val+'$' : '', true, false )
                                .draw();
                        } );

                    column.data().unique().sort().each( function ( d, j ) {
                        select.append( '<option value="'+d+'">'+d+'</option>' )
                    } );
             
                }
            } );
            var topPlugin = '<button id="verify_pass" style="margin-left:10px;" class="btn btn-primary btn-sm float-r">通过</button><button id="verify_reject" style="margin-left:10px;" class="btn btn-danger btn-sm float-r">驳回</button>';
            $("#data-verify-table_length").append(topPlugin);//在表格上方topPlugin DIV中追加HTML
        },
        columnDefs: [{
           'targets': 0,
           'searchable':false,
           'orderable':false,
           'className': 'dt-body-center',
        }],

    });
    
    var data_list = [];
    $('#data-verify-table #check-all').on('click',function(){
        // data_verify_table.columns().select();
        // Check/uncheck all checkboxes in the table
        // var rows = data_verify_table.rows({ 'search': 'applied' }).nodes();
        var rows = data_verify_table.rows({ 'search': 'applied','page':'current' }).nodes();
        // rows.select();
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
        // Iterate over all checkboxes in the table
        data_list = [];
        data_verify_table.$('input[type="checkbox"]').each(function(){
           // If checkbox doesn't exist in DOM
           if($.contains(document, this)){
              // If checkbox is checked
              if(this.checked){
                 // Create a hidden element
                 console.log($(this).parents('tr').attr('data-id'));
                 data_list.push($(this).parents('tr').attr('data-id'));
              }
           }
        });

    });

    data_verify_table.on('click','input[type="checkbox"]',function(){
        var data_id = $(this).parents('tr').attr('data-id');
        if(!data_id) return;
        if(this.checked){
            data_list.push( data_id );
        } 
        else{
            var index = data_list.indexOf(data_id) ;
            if (index >=0){
                data_list.splice(index,1);  
            }
        }
    });

	$.ajax({
		cache:false,
		type:'GET',
		url:'/get_unverified_indicator_data',
		dataType:"json",
        data:{},
		success:function(json){
            config.parsebody(json,append_unverified_data);
		},
		error:function(){
            alert('网络错误，请重试!');
		}
	});

    var append_unverified_data = function(ret){
        var data_list = ret.data_list;
        var tr_str = '';
        window.data_proof = {};
        for(var index in data_list){
            var e = data_list[index];
            tr_str += '<tr data-id="'+e.id+'">'
                  +'<td><input type="checkbox"></input></td>'
                  +'<td>'+e.project_name+'</td>'
                  +'<td>'+e.indicator_name+'</td>'
                  +'<td>'+e.data+'</td>'
                  +'<td>'+moment.unix(e.timestamp).format("YYYY-MM-DD")+'</td>'
                  +'<td>'+e.operator+'</td>'
             if(e.proof.text || e.proof.attachment){
                 window.data_proof[e.id] = e.proof;
                  tr_str += '<td data-proof='
                      +'><button class="btn btn-danger btn-xs show-data-proof">查看证据</button></td></tr>'
             }else{
                  tr_str += '<td><label class="label label-success label-xs">无证据</label></td></tr>'
             }

        }
        data_verify_table.rows.add($(tr_str)).draw();
        get_filter_select_value();
    }

    $('#data-verify-table').on('click','.show-data-proof',function(){
        var data_id = $(this).parents('tr').data('id');
        var proof = window.data_proof[data_id];
        // var proof_list = JSON.parse(proof_str);
        // $('#data-proof-list-ul').empty();
        // for(var index in proof_list){
        //     var p = proof_list[index];
        //     $('#data-proof-list-ul').append('<li><a href="'+p
        //             +'">'+p.split('/').pop()
        //             +'</a></li>'); 
        // }
        var temp = '';
        
        temp += '<div style="border-bottom:1px solid #E0E5EF;margin-botton:15px;padding-left:20px;">';
        if(proof.text){

            temp +='<h5 style="background-color:#06ad3d;padding:5px;">文本：</h5>'
                +'<div id="report-content">' + proof.text
                +'</div>'
        }
            var attachment = proof.attachment;
        if(attachment.length > 0){
            temp += '<h5 style="background-color:#06ad3d;padding:5px;"><i class="fa fa-fw fa-external-link"></i>文件：</h5>'
                temp += '<ul>';
            for (var i in attachment){
                var a = attachment[i];
                temp += '<li><a target="_blank" href="'+a['link']+'">'+a['filename']+'</a></li>'
            }
            temp += '</ul>';
        }

        temp += '</div>';

        $('#data-proof-modal').find('.modal-body').html(temp);
        $('#data-proof-modal').modal('show');
    });

    function get_filter_select_value(){
        data_verify_table.columns().eq(0).each( function ( index ) {
            if (index > 0){
                var column = data_verify_table.column( index );
                var select = $('<select class="form-control input-sm"><option value=""></option></select>')
                    .appendTo( $(column.footer()).empty() )
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );

                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );

                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option value="'+d+'">'+d+'</option>' )
                } );
         
            }
        } );
    
    }

    function verify_indicator_data(isok){
        $('#verify-data-box .overlay').show();
        function delete_rows(){
            var rows = data_verify_table.rows({ 'search': 'applied'}).nodes();
            data_verify_table.$('input[type="checkbox"]').each(function(){
                  if(this.checked){
                     data_verify_table.row($(this).parents('tr')).remove().draw();
               }
            });
            get_filter_select_value();
            data_list=[];
        };
	    $.ajax({
	    	cache:false,
	    	type:'POST',
	    	url:'/verify_indicator_data',
	    	dataType:"json",
            data:{
                'data_list':JSON.stringify(data_list),
                'isok'     :isok
            },
	    	success:function(json){
                config.parsebody(json,delete_rows);
                $('#verify-data-box .overlay').hide();
	    	},
	    	error:function(){
                alert('网络错误，请重试!');
                $('#verify-data-box .overlay').hide();
	    	}
	    });
    
    }

    $('#data-verify-table_wrapper #verify_pass').on('click',function(){
        if(confirm('确认通过？')){
            verify_indicator_data('true'); 
        }

    });

    $('#data-verify-table_wrapper #verify_reject').on('click',function(){
        if(confirm('确认驳回？')){
            verify_indicator_data('false'); 
        }

    });

    var project_d = {};
    function reset_fc_select_btn(callback){
        var project_d_copy = $.extend(true,{},project_d);
        var p_select = $('#unverified-fp-list');
        var t_select = $('#unverified-fp-time-list');
        p_select.empty();
        t_select.empty();
        for (var p in project_d_copy){
            if( project_d_copy[p]['data_time'].length <= 0 ){
                delete project_d[p]; 
                continue;
            } 
            p_select.append('<li><a data-p_id="'
                    +p+'" href="javascript:(0);">'
                    +project_d[p]['p_name']+'</a></li>'); 
        } 
        $('#financial_verify_report').empty();
        if( Object.keys(project_d).length > 0 ){
            p_select.find('li:first').addClass('active');
            var p_id = p_select.find('li.active').find('a').data('p_id');
            for (var t in project_d[p_id]['data_time']){
                t_select.append('<li><a href="javascript:(0);">'
                        +project_d[p_id]['data_time'][t]+'</a></li>'); 
            }
            var t_node = t_select.find('li:first');
            t_node.addClass('active');
            var t = t_node.find('a').html();
            callback(p_id,t);
        }
    }

    function set_financial_verify_report(p_id,data_time,callback){
        $.ajax({
            cache:false,
            type:'GET',
            url:'/get_unverified_financial_data_by_fc',
            dataType:"html",
            data:{
                project_id:p_id,
                data_time:data_time
            },
            success:function(data){
                $('#financial_verify_report').html(data);
                init_financial_report_table();
                callback && callback();
            },
            error:function(){
                alert('网络错误，请重试!');
            }
        });
    
    }

    var language = {
                "decimal":        "",
                "emptyTable":     "没有可用的数据",
                "info":           "显示 _TOTAL_ 行中的 _START_ 到 _END_ 行",
                "infoEmpty":      "共 0 行",
                "infoFiltered":   "(filtered from _MAX_ total entries)",
                "infoPostFix":    "",
                "thousands":      ",",
                "lengthMenu":     "显示 _MENU_ 行",
                "loadingRecords": "加载中...",
                "processing":     "正在处理中...",
                "search":         "搜索:",
                "zeroRecords":    "找不到匹配的记录",
                "paginate": {
                    "first":      "第一页",
                    "last":       "最后一页",
                    "next":       "下一页",
                    "previous":   "上一页"
                },
                "aria": {
                    "sortAscending":  ": 升序排序",
                    "sortDescending": ": 降序排序"
                }  
            }; 

    var report_table_1 = null;
    var report_table_2 = null;
    var report_table_3 = null;

    function init_financial_report_table(){
        var column_def_list = [];
        // var column_length = $('#tab-1 table thead th').length;
        for(var i=0;i< 4;i++){
            var column_def = {
                targets:[i],
                orderData:[0,i],
            };
            if(i==0){
                column_def['visible']=false;
            }
            else if(i==1){
                column_def['orderable']=false;
            }else{
                column_def.className = 'text-right';
            }
            column_def_list.push(column_def);
        }
        report_table_1 = $('#tab_1 table').DataTable({
            searching: false,
            paging:false,
            orderFixed: [ 0, 'asc' ],
            columnDefs:column_def_list,
            language:language

        }); 
        report_table_2 = $('#tab_2 table').DataTable({
            searching: false,
            paging:false,
            orderFixed: [ 0, 'asc' ],
            columnDefs:column_def_list,
            language:language

        }); 
        report_table_3 = $('#tab_3 table').DataTable({
            searching: false,
            paging:false,
            orderFixed: [ 0, 'asc' ],
            columnDefs:column_def_list,
            language:language

        }); 
        
         
    }

    function get_unverified_financial_dt_list(){

        $.ajax({
            cache:false,
            type:'GET',
            url:'/get_unverified_data_time_list',
            dataType:"json",
            data:{},
            success:function(json){
                config.parsebody(json,function(result){
                    $.extend(true,project_d,result);
                    reset_fc_select_btn(set_financial_verify_report);

                });
            },
            error:function(){
                alert('网络错误，请重试!');
            }
        });
    }

    get_unverified_financial_dt_list();

    $('#unverified-fp-list').on('click','a',function(){
        $('#unverified-fp-list').find('.active').removeClass('active');
        $(this).parents('li').addClass('active');
        var p_elem = $(this);
        var p_id = p_elem.data('p_id');
        var t_select = $('#unverified-fp-time-list');
        t_select.empty();
        for (var t in project_d[p_id]['data_time']){
            t_select.append('<li><a href="javascript:(0);">'
                    +project_d[p_id]['data_time'][t]+'</a></li>'); 
        }
        var t_node = t_select.find('li:first');
        t_node.addClass('active');
        var t = t_node.find('a').html();
        $('#financial_verify_report').empty();
        set_financial_verify_report(p_id,t);
    });

    $('#unverified-fp-time-list').on('click','a',function(){
        $('#unverified-fp-time-list').find('.active').removeClass('active');
        $(this).parents('li').addClass('active');
        var t_elem = $(this);
        var p_elem = $('#unverified-fp-list').find('.active a');

        $('#financial_verify_report').empty();
        set_financial_verify_report(p_elem.data('p_id'),t_elem.html());
    });

    function get_new_month(li){
        var new_li = null
        if (li.prev().length > 0){
            new_li = li.prev();
            new_li.addClass('active');
            return new_li;
        }else if(li.next().length > 0){
            new_li = li.next();
            new_li.addClass('active');
            return new_li;
        }else{
            return null
        }
    }

    $('#financial-data-pass').on('click',function(){
         var p_elem = $('#unverified-fp-list').find('.active');
         var t_elem = $('#unverified-fp-time-list').find('.active');

        if(confirm('确认通过？')){
             $('#verify-financial-data-box .overlay').show();
             verify_financial_data('true',p_elem,t_elem,verify_callback);
        }


    });
    $('#financial-data-reject').on('click',function(){
         var p_elem = $('#unverified-fp-list').find('.active');
         var t_elem = $('#unverified-fp-time-list').find('.active');
        if(confirm('确认驳回？')){
             $('#verify-financial-data-box .overlay').show();
             verify_financial_data('false',p_elem,t_elem,verify_callback);
        }


    });

    function verify_callback(p_elem,t_elem){
        var old_t_li = t_elem;
        var new_li = get_new_month(old_t_li);
        old_t_li.remove();
        var p_id = p_elem.find('a').data('p_id');
        var old_data_time = t_elem.html();
        var index = project_d[p_id]['data_time'].indexOf(old_data_time);
        project_d[p_id]['data_time'].splice(index,1);
        if(new_li){
            var new_time = new_li.find('a').html();
            set_financial_verify_report(p_id,new_time)

        }else{
            reset_fc_select_btn(set_financial_verify_report);
        }
        $('#verify-financial-data-box .overlay').hide();
    }

    
    function verify_financial_data(flag,p_elem,t_elem,callback){
        
	    $.ajax({
	    	cache:false,
	    	type:'POST',
	    	url:'/verify_indicator_data',
	    	dataType:"json",
            data:{
                'data_list':$('#report-data-id-input').val(),
                'isok'     :flag
            },
	    	success:function(json){
                config.parsebody(json,function(){
                    callback(p_elem,t_elem);
                });
                $('#verify-financial-data-box .overlay').hide();
	    	},
	    	error:function(){
                alert('网络错误，请重试!');
                $('#verify-financial-data-box .overlay').hide();
	    	}
	    });
    
    }

})(this);

