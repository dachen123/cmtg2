<template>
    <tr :id="id_string(item.user_id)">
        <td>{{item.name}}</td>
        <td><img :src="item.image" class="img-circle" alt="User Image" style="max-width:45px;"></td>
        <td>{{job_level_map(item.job_level)}}</td>
        <td>{{job_role_map(item.job_role)}}</td>
        <td>{{item.phone}}</td>
        <td>{{item.email}}</td>
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
        data:function(){
            return{
                job_level_text:{
                    'super':'系统管理员',
                    'admin':'机构行政管理员',
                    'partner':'机构合伙人',
                    'director':'机构总监',
                    'manager':'机构经理',
                    'master':'被投公司负责人',
                    'clerk' :'被投公司职员'
                },
                job_role_text:{
                    'none':'行政管理权限', 
                    'all'   :'所有业务权限',
                    'financial':'财务业务权限',
                    'legal':'法务业务权限',
                    'invest':'投资业务权限',
                    'input_master':'被投公司负责人',
                    'input_account':'被投公司会计'
                }
            } 
        },
        methods:{
            id_string:function(id){
                return "user-"+id
            },
            trans_data:function(){
                this.$emit('trans_data',this.item); 
            },
            del_user:function(){
                this.$emit('del_user',this.item); 
            },
            job_level_map:function(job_level){
                return this.job_level_text[job_level]; 
            },
            job_role_map:function(job_role){
                return this.job_role_text[job_role]; 
            }
        }
        
    }

</script>


