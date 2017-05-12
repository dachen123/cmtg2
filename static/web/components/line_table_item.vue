<template>
    <div :id="id_string(table.indicator_id)" class="col-md-6">
        <div class="box">
            <div class="box-header">
                <h3 class="box-title">{{table.indicator_name}}表</h3>
            </div>
            <!-- /.box-header -->
            <div class="box-body table-responsive no-padding">
                <table class="table table-hover">
                    <tbody>
                        <tr>
                            <th>时间</th>
                            <th>数值</th>
                            <th>描述</th>
                        </tr>
                        <tr v-for="data in table.data_list">
                            <td>{{data.data_time}}</td>
                            <td>{{data.data_value}}</td>
                            <td></td>
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
        methods:{
            id_string:function(id){
                return "indicator-"+id
            }
        }
        
    }

</script>

