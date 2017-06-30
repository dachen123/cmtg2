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
                            <th>数值</th>
                            <!-- <th>描述</th> -->
                        </tr>
                        <tr v-for="data in my_table.data_list">
                            <td>{{data.data_time}}</td>
                            <td>{{data.data_value}}</td>
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
            }
        }
    }

</script>

