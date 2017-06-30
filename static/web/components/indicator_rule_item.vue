<template>
    <tr :id="id_string(item.rule_id)">
        <td><a href="#">{{statistic_style[item.statistic_style]}}</a></td>
        <td>{{compare_target[item.compare_target]}}</td>
        <td>
            {{compare_mode[item.compare_mode]}}
        </td>
        <td>{{item.expect}}</td>
        <td>
            <button v-on:click="trans_data" class="btn btn-xs btn-primary" style="margin-right:5px;">编辑</button>
            <button v-on:click="del_rule" class="btn btn-xs btn-danger" >删除</button>
        </td>
    </tr>

</template>

<script>
export default {
    props:['item','index'],
    data:function(){
        return{
            statistic_style:{
                raw:"原始值",
                accumulate:"累计值",
                mean      :"算术平均",
                linkrelative:"环比"
            },
            compare_mode:{
                higher:"高于",
                lower:"低于",
                equal: "等于",
                nothigher:"不高于",
                notlower:"不低于",
                notequal:"不等于"
            },
            compare_target:{
                expect_value:"预期值比",
                indicator:"其他指标比"
            }
        }
    },
    methods:{
        id_string:function(id){
            return "rule-"+id
        },
        trans_data:function(){
            this.$emit('trans_data',this.item); 
        },
        del_rule:function(){
            this.$emit('del_rule',this.item); 
        }
    }

}
</script>
