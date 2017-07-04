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
            project_info_list:[]
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
                this.$http.get('/get_unsolved_indicator',{})
                    .then(function(res){
                        this.urgent_indicator_list = res.body.result.indicator_info_list
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
                        this.project_info_list = res.body.result.project_info_list
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
                this.$http.post('/delete_company',{
                    company_id: company.company_id
                })
                    .then(function(res){
                        this.fetch_company_list()
                    }) 
            
            },
            verify_aevent:function(aevent,flag){
                this.$http.post('/solve_aevent',{
                    aevent_id: aevent.aevent_id,
                    flag    :flag
                })
                    .then(function(res){
                        this.fetch_to_me_verify_aevent()
                    }) 
            }
        }
        
    });

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
        for(var index in data_list){
            var e = data_list[index];
            tr_str += '<tr data-id="'+e.id+'">'
                  +'<td><input type="checkbox"></input></td>'
                  +'<td>'+e.project_name+'</td>'
                  +'<td>'+e.indicator_name+'</td>'
                  +'<td>'+e.data+'</td>'
                  +'<td>'+moment.unix(e.timestamp).format("YYYY-MM-DD")+'</td>'
                  +'<td>'+e.operator+'</td>'
             if(e.proof.length > 0){
                  tr_str += '<td data-proof='+ JSON.stringify(e.proof)
                      +'><button class="btn btn-danger btn-xs show-data-proof">查看证据</button></td></tr>'
             }else{
                  tr_str += '<td><label class="label label-success label-xs">无证据</label></td></tr>'
             }

        }
        data_verify_table.rows.add($(tr_str)).draw();
        get_filter_select_value();
    }

    $('#data-verify-table').on('click','.show-data-proof',function(){
        var proof_str = $(this).parents('td').attr('data-proof');
        var proof_list = JSON.parse(proof_str);
        $('#data-proof-list-ul').empty();
        for(var index in proof_list){
            var p = proof_list[index];
            $('#data-proof-list-ul').append('<li><a href="'+p
                    +'">'+p.split('/').pop()
                    +'</a></li>'); 
        }
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

    function verify_indicator_data(isok='true'){
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

})(this);

