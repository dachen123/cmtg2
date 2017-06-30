<template>
    <tr :id="id_string(item.indicator_id)">
        <td>
            <input v-model="is_checked" type="checkbox"></input>
        </td>
        <td>
            {{item.indicator_name}}
        </td>
        <td>
            <select v-model="item.indicator_property" class="form-control input-sm">
                <option value="integer">整型</option>
                <option value="float">浮点</option>
                <option value="string">字符串</option>
                <option value="boolean">布尔</option>
            </select>
        </td>
        <td>
            <select v-model="item.collect_period" class="form-control input-sm">
                <option value="day">天</option>
                <option value="week">周</option>
                <option value="month">月</option>
                <option value="season">季度</option>
                <option value="year">年</option>
            </select>
        </td>
        <td>
            <select v-model="item.forum.board_id" class="form-control input-sm">
                <option v-for="(item,index) in board_list" :selected="index == 0" :value="item.board_id" >{{item.name}}</option>
            </select>

        </td>
    </tr>

</template>

<script>
    export default {
        props:['item','index','board_list'],
        data:function(){
            return{
                is_checked:true,
                board:"",
            }
        },
        methods:{
            id_string:function(val){
                return "indicator-"+this.item.indicator_id 
            }
        }
        
    }

</script>


