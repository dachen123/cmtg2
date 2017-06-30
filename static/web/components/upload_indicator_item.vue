<template>
    <tr :id="id_string(item.indicator_id)">
        <td>
            {{item.indicator_name}}
        </td>
        <td>
            <select v-model="item.indicator_property" class="form-control input-sm">
                <option value="int">整型</option>
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
            <select v-model="board" class="form-control input-sm">
                <option v-for="(item,index) in board_list" :selected="option_is_selected(item.board_id)" :value="item.board_id" >{{item.name}}</option>
            </select>

        </td>
    </tr>

</template>

<script>
    export default {
        props:['item','index','board_list','board_id'],
        data:function(){
            return{
                board:null,
                collect_period:"day",
                indicator_property:"int",
            }
        },
        created:function(){
            if(!this.board){
                this.board = this.board_list[0].board_id; 
            }
        },
        methods:{
            id_string:function(val){
                return "indicator-"+this.item.indicator_id 
            },
            option_is_selected:function(val){
                if(val == this.board_id){
                    this.board=val;
                    return true; 
                }else{
                    return false; 
                } 
            }
        }
        
    }

</script>


