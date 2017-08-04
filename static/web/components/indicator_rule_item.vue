<template>
    <tr :id="id_string(item.rule_id)">
        <td><a href="#">{{statistic_style[item.statistic_style]}}</a></td>
        <td>
            {{compare_target_text(item)}}
        </td>
        <td>{{compare_mode[item.compare_mode]}}</td>
        <td>{{expect_text(item.expect)}}</td>
        <td>{{check_time(item.check_time)}}</td>
        <td>{{item.delay_days}}</td>
        <td>
            <button v-on:click="trans_data" class="btn btn-xs btn-primary" style="margin-right:5px;">编辑</button>
            <button v-on:click="del_rule" class="btn btn-xs btn-danger" >删除</button>
        </td>
    </tr>

</template>

<script>
export default {
    props:['item','index','indicator_property'],
    data:function(){
        return{
            statistic_style:{
                raw:"原始值",
                accumulate:"累计值",
                mean      :"算术平均",
                linkrelative:"环比",
                yearbegin:"年初余额"
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
        },
        compare_target_text:function(item){
            if(item.compare_target == 'expect_value'){
                return '预期值' ;
            }else{
                return  item.related_indicator_name;
            } 
        },
        check_time:function(time){
            var d = new Date(time*1000);
            //return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
            var moment_time = moment.unix(time);
            if(this.item.repeat_period == 'none'){
                return moment_time.format('YYYY-MM-DD');
            }else if(this.item.repeat_period == 'day'){
                return '每天';
            
            }else if(this.item.repeat_period == 'week'){
                return '每周周'+moment_time.isoWeekday(); 
            }else if(this.item.repeat_period == 'month'){
                if(!time){
                    return '月末' 
                }else{
                    return '每月第'+moment_time.date()+'天'; 
                }
            
            }else if(this.item.repeat_period == 'season'){
                if(!time){
                    return '季度末' 
                }else{
                    return '每季度第'+moment_time.date()+'天'; 
                }
            
            }else if(this.item.repeat_period == 'year'){
                return '每年'+(moment_time.month()+1)+'月'+moment_time.date()+'日';
            
            }else if(this.item.repeat_period == 'fortnight'){
                return '每两周周'+moment_time.isoWeekday(); 
            
            }else{
                return moment.unix(time).format('YYYY-MM-DD');
            }
        },
        expect_text:function(val){
            if(this.indicator_property == 'boolean'){
                return  val == '1' ? '真' : '假'; 
            }else{
                return  val; 
            
            } 
        }
    }

}
</script>
