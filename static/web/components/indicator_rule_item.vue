<template>
    <tr :id="id_string(item.rule_id)">
        <td><a href="#">累积值</a></td>
        <td>预期值比</td>
        <td>
            等于
        </td>
        <td>{{item.expect}}</td>
        <td>
            <button v-on:click="trans_data" class="btn btn-xs btn-primary" style="margin-right:5px;">编辑</button>
            <button class="btn btn-xs btn-danger" >删除</button>
        </td>
    </tr>

</template>

<script>
export default {
    props:['item','index'],
    methods:{
        id_string:function(id){
            return "rule-"+id
        },
        trans_data:function(){
            this.$emit('trans_data',this.item); 
        }
    }

}
</script>
