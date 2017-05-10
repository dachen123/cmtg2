<template>
    <li :id="id_string(item.project_id)" class="item">
        <div class="product-img">
            <img :src="item.project_image" alt="Product Image">
        </div>
        <div class="product-info">
            <a :href="item.home_addr" class="product-title">{{item.project_name}}
                <!-- <span class="label label&#45;warning pull&#45;right">$1800</span> -->
                <button class="btn btn-xs btn-danger pull-right">删除</button>
                <button class="btn btn-xs btn-primary pull-right update-project-btn" style="margin-right:10px;">编辑</button>
            </a>
            <span class="product-description">
                {{item.project_desc}}
            </span>
        </div>
    </li>
    <!-- /.item -->

</template>

<script>
    export default {
        props:['item','index'],
        methods:{
            id_string:function(id){
                return "project-"+id
            }
        }
        
    }

</script>


