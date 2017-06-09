<template>
    <tr :id="id_string(item.user_id)">
        <td>{{item.name}}</td>
        <td><img :src="item.image" class="img-circle" alt="User Image" style="max-width:45px;"></td>
        <td>{{item.job_level}}</td>
        <td>{{item.phone}}</td>
        <td>{{item.email}}</td>
        <td>普通</td>
        <td>{{item.company}}</td>
        <td>
            <button v-on:click="trans_data" class="btn btn-xs btn-primary" style="margin-right:5px;">编辑</button>
            <button v-on:click="del_user"  class="btn btn-xs btn-danger" >删除</button></td>
    </tr>

    <!-- /.item -->

</template>

<script>
    export default {
        props:['item','index'],
        methods:{
            id_string:function(id){
                return "user-"+id
            },
            trans_data:function(){
                this.$emit('trans_data',this.item); 
            },
            del_user:function(){
                this.$emit('del_user',this.item); 
            }
            

        }
        
    }

</script>


