<template>
    <li :id="id_string(item.project_id)" class="item">
        <div class="product-img">
            <img :src="item.image" alt="Product Image">
        </div>
        <div class="product-info">
            <span class="product-title"><a :href="item.home_addr" >{{item.project_name}}</a>
                <!-- <span class="label label&#45;warning pull&#45;right">$1800</span> -->
                <button v-on:click="del_project" class="btn btn-xs btn-danger pull-right">删除</button>
                <button v-on:click="redirect_to_update" class="btn btn-xs btn-primary pull-right update-project-btn" style="margin-right:10px;">编辑</button>
            </span>
            <span class="product-description">
                {{item.project_desc}}
            </span>
        </div>
    </li>
    <!-- /.item -->

</template>

<script>
    export default {
        props:['item','index','project_id','company_id'],
        methods:{
            id_string:function(id){
                return "project-"+id
            },
            redirect_to_update:function(){
                window.location.href='/edit_project?project_id='+this.item.project_id+'&parent_id='+this.project_id+'&company_id='+this.company_id;
            },
            del_project:function(){
                this.$emit('del_project',this.item); 
            }
        }
        
    }

</script>


