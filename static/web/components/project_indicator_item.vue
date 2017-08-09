<template>
    <tr :id="id_string(item.indicator_id)">
        <td style="max-width:250px;"><a :href="item.chart_addr">{{item.indicator_name}}</a></td>
        <td>{{item.forum.name}}</td>
        <!-- <td> -->
        <!--     {{item.statistics_method}} -->
        <!-- </td> -->
        <!-- <td> -->
        <!--     原始值 -->
        <!-- </td> -->
        <!-- <td><span class="label label-success">{{item.status}}</span></td> -->
        <td>
            <span v-if="item.status==='normal'" class="label label-success">正常</span>
            <span v-else-if="item.status==='alarm'" class="label label-danger">报警</span>
        </td>
        <td>
            <button v-on:click="redirect_to_update" class="btn btn-xs btn-primary update-index-btn life-status" style="margin-right:5px;">编辑</button>
            <button v-on:click="del_indicator" class="btn btn-xs btn-danger life-status" >删除</button></td>
    </tr>

</template>

<script>
    export default {
        props:['item','index'],
        methods:{
            id_string:function(id){
                return "indicator-"+id
            },
            redirect_to_update:function(){
                window.location.href='/edit_indicator?indicator_id='+this.item.indicator_id+'&project_id='+this.item.project_id;
            },
            del_indicator:function(){
                this.$emit('del_indicator',this.item); 
            }
        }
        
    }

</script>


