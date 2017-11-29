<template>
    <div :id="id_string(my_table.indicator_id)" class="col-md-6">
        <div class="box">
            <div class="box-header">
                <h3 class="box-title">{{my_table.indicator_name}}表</h3>
                <div class="box-tools pull-right">
                    <ul class="pagination pagination-sm inline">
                        <li><a v-on:click.prevent="prev_page_data" href="#">&laquo;</a></li>
                        <li><a v-on:click.prevent="next_page_data" href="#">&raquo;</a></li>
                    </ul>

                </div>

            </div>
            <!-- /.box-header -->
            <div class="box-body table-responsive no-padding">
                <table class="table table-hover">
                    <tbody>
                        <tr>
                            <th>时间</th>
                            <th>
                                数值
                            </th>
                            <!-- <th>描述</th> -->
                        </tr>
                        <tr v-for="data in my_table.data_list">
                            <td>{{data.data_time}}</td>
                            <td>
                                {{data.data_value}}
                                <button v-if="table.statistic_style == 'raw' && table.data_type=='statistic'" v-on:click="get_indicator_data_track(data.data_time)" type="button" class="btn btn-box-tool"><i class="fa fa-history"></i></button>
                                <button  v-if="table.statistic_style == 'raw' && table.data_type=='statistic'" v-on:click="get_data_proof_by_date(data.data_time)"  type="button" class="btn btn-box-tool"><i class="fa fa-paperclip"></i></button>
                            </td>
                            <!-- <td></td> -->
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- /.box-body -->
        </div>
        <!-- /.box -->
    </div>
</template>

<script>
    export default {
        props:['table','index'],
        data:function(){
            return{
                data_start_index:1,
                data_count:20,
                my_table:this.table
            }
        },
        watch:{
            table:function(){
                this.my_table = this.table; 
            }
        },
        methods:{
            id_string:function(id){
                return "indicator-"+id
            },
            prev_page_data:function(){
                if(this.data_start_index == 1){
                    alert("已经在第一页了"); 
                    return;
                }
                var prev_start_index = this.data_start_index - this.data_count;
                if (prev_start_index < 0){
                    this.data_start_index = prev_start_index;
                }else{
                    this.data_start_index = prev_start_index;
                }
                var comp = this;
                chart.$http.get('/get_indicator_table_by_data_type',{
                    params:{
                        project_id:this.table.project_id,
                        data_type:this.table.data_type,
                        indicator_id:this.table.indicator_id,
                        start_index:this.data_start_index,
                        count:this.data_count,
                        statistic_style:this.table.statistic_style,
                        period:this.table.period
                    }
                })
                    .then(function(res){
                        //this.table = res.body.result.table_data
                        comp.my_table = res.body.result.table_data
                    }) 
            },
            next_page_data:function(){
                var comp = this;
                var next_page_start = this.data_start_index + this.data_count;
                chart.$http.get('/get_indicator_table_by_data_type',{
                    params:{
                        project_id:this.table.project_id,
                        data_type:this.table.data_type,
                        indicator_id:this.table.indicator_id,
                        start_index:next_page_start,
                        count:this.data_count,
                        statistic_style:this.table.statistic_style,
                        period:this.table.period
                    }
                })
                    .then(function(res){
                        var table = res.body.result.table_data
                        if(table.data_list <= 0){
                            alert("没有更多数据了"); 
                        }else{
                           comp.my_table = table;
                           comp.data_start_index = next_page_start;
                        }
                    }) 
            },
            get_indicator_data_track:function(data_date){
                var comp = this;
                chart.$http.get('/get_indicator_data_track',{
                    params:{
                        project_id:this.table.project_id,
                        indicator_id:this.table.indicator_id,
                        data_date:data_date
                    }
                }).then(function(res){
                    if(res.body.error_code == 'OK'){
                        var track = res.body.result.track;
                        if(!track){
                            track = [];
                        }
                        var modal =  $('#data-track-modal');
                        var op={
                            'ADD':'新增',
                            'UPDATE':'修改'
                        }
                        modal.find('#data-track-list-ul').empty();
                        for(var index in track){
                            var t = track[index];
                            modal.find('#data-track-list-ul').append('<li>'
                            +'<b>操作：</b>'+op[t.operation]+'<br/>'
                            +'<b>数据：</b>'+t.data+'<br/>'
                            +'<b>操作者：</b>'+t.operator+'<br/>'
                            +'<b>修改时间：</b>'+t.timestamp+'<br/>'
                            +'</li>');
                        }
                        modal.modal('show');
                    }else{
                        alert('网络繁忙，稍后重试'); 
                    }
                })
            },
            get_data_proof_by_date:function(data_date){
                var comp = this;
                chart.$http.get('/get_data_proof_by_date',{
                    params:{
                        project_id:this.table.project_id,
                        indicator_id:this.table.indicator_id,
                        data_date:data_date
                    }
                }).then(function(res){
                    if(res.body.error_code == 'OK'){
                        var proof = res.body.result.proof;
                        //if(!proof_list){
                        //    proof_list=[]; 
                        //}
                        var modal = $('#data-proof-modal');
                        //modal.find('#data-proof-list-ul').empty();
                        //for(var index in proof_list){
                        //    var p = proof_list[index]; 
                        //    $('#data-proof-list-ul').append('<li><a href="'+p
                        //    +'">'+p.split('/').pop()
                        //    +'</a></li>'); 
                        //}

                        var temp = '';

                        temp += '<div style="border-bottom:1px solid #E0E5EF;margin-botton:15px;padding-left:20px;">';
                        if(proof.text){

                            temp +='<h5 style="background-color:#06ad3d;padding:5px;">文本：</h5>'
                            +'<div id="report-content">' + proof.text
                            +'</div>'
                        }
                        var attachment = proof.attachment;
                        if(attachment && attachment.length > 0){
                            temp += '<h5 style="background-color:#06ad3d;padding:5px;"><i class="fa fa-fw fa-external-link"></i>文件：</h5>'
                            temp += '<ul>';
                            for (var i in attachment){
                                var a = attachment[i];
                                temp += '<li><a target="_blank" href="'+a['link']+'">'+a['filename']+'</a></li>'
                            }
                            temp += '</ul>';
                        }

                        temp += '</div>';

                        modal.find('.modal-body').html(temp);
                        modal.modal('show');
                    }else{
                        alert('网络繁忙，稍后重试'); 
                    }
                })
            }
        }
    }

</script>

