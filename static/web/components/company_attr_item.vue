<template>
    <tr :id="id_string(item.attr_id)">
        <td>{{item.attr_name}}</td>
        <td>{{input_type_text[item.input_type]}}</td>
        <td>{{attach_value_text(item.attach_value)}}</td>
        <td>
            <button v-on:click="trans_data" class="btn btn-xs btn-primary" style="margin-right:5px;">编辑</button>
            <button v-on:click="del_company_attr"  class="btn btn-xs btn-danger" >删除</button>
            <span v-on:click="rank_company_attr('up')" class="glyphicon glyphicon-arrow-up" style="display:inline-block;margin-left:10px;cursor:pointer;"></span>
            <span v-on:click="rank_company_attr('down')" class="glyphicon glyphicon-arrow-down" style="display:inline-block;margin-left:10px;cursor:pointer;"></span>
        </td>

    </tr>

    <!-- /.item -->

</template>

<script>
    export default {
        props:['item','index'],
        data:function(){
            return{
                input_type_text:{
                    'number':'数值输入',
                    'string':'文字输入',
                    'enum':'下拉选择输入',
                    'date': '日期格式输入'
                }
            } 
        },
        methods:{
            id_string:function(id){
                return "attr-"+id
            },
            trans_data:function(){
                this.$emit('trans_data',this.item); 
            },
            del_company_attr:function(){
                this.$emit('del_company_attr',this.item); 
            },
            attach_value_text:function(attach_value){
                if(this.item.input_type == 'enum' && attach_value && attach_value != ""){
                    return  attach_value.join('；'); 
                }else{
                    return attach_value; 
                }
            },
            rank_company_attr:function(rank_dir){
                this.$emit('rank_company_attr',this.item,rank_dir);
            }
        }
        
    }

</script>


