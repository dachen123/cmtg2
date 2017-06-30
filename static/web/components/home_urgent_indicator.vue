<template>
    <li v-bind:id="id_string(item.indicator_id)">
        <!-- drag handle -->
        <span class="handle">
            <i class="fa fa-ellipsis-v"></i>
            <i class="fa fa-ellipsis-v"></i>
        </span>
        <!-- todo text -->
        <span class="text">{{item.indicator_name}}有未处理事件</span>
        <!-- General tools such as edit or delete-->
        <div class="pull-right">
            <button v-on:click="get_indicator_aevent" type="button" class="btn btn-sm btn-danger" style="margin-top: -5px;">查看详情</button>
        </div>
    </li>


</template>

<script>
    export default {
        props:['item','index'],
        methods:{
            id_string:function(id){
                return "indicator-"+id
            },
            get_indicator_aevent:function(){
                window.location.href="/get_indicator_aevent?indicator_id="+this.item.indicator_id;
            }
        }
        
    }

</script>


