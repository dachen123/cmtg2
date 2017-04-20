<template>
    <li v-bind:id="id_string(item.indicator_id)">
        <!-- drag handle -->
        <span class="handle">
            <i class="fa fa-ellipsis-v"></i>
            <i class="fa fa-ellipsis-v"></i>
        </span>
        <!-- todo text -->
        <span class="text">{{indicator_name}}未处理</span>
        <!-- General tools such as edit or delete-->
        <div class="pull-right">
            <button type="button" class="btn btn-sm btn-danger" style="margin-top: -5px;">确认处理</button>
        </div>
    </li>


</template>

<script>
    export default {
        name:'urgent_indicator_li',
        props:['item'],
        methods:{
            id_string:function(id){
                return "indicator-"+id
            }
        }
    }

</script>


