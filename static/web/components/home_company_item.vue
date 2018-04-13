<template>
    <li :id="id_string(item.company_id)" class="item attachment-block ">
        <img class="attachment-img" :src="item.company_image" alt="Attachment Image">
        <div class="attachment-pushed">
            <h4 class="attachment-heading"><a :href="item.home_addr">{{item.company_name}}</a>
            <button v-if="show_btn" v-on:click="del_company" class="btn btn-xs btn-danger pull-right">删除</button>
            <button  v-if="show_btn" v-on:click="redirect_to_update" class="btn btn-xs btn-primary pull-right" style="margin-right:10px;">编辑</button>
</h4>

            <div class="attachment-text">
                <!-- {{item.company_desc}}<a href="#">more</a> -->
                {{item.company_desc}}
            </div>
            <!-- /.attachment-text -->
        </div>
    </li>
    <!-- /.item -->

</template>

<script>
    export default {
        props:['item','index'],
        data:function(){
            return {
                show_btn:true
            }
        },
        created:function(){
            var user_info = localStorage.getItem('user_info');
            user_info = JSON.parse(user_info);
            if(user_info.job_level == 'master' || user_info.job_level == 'clerk'){
                this.show_btn=false;
            }
        },
        methods:{
            id_string:function(id){
                return "company-"+id
            },
            redirect_to_update:function(){
                window.location.href=this.item.edit_addr; 
            },
            del_company:function(){
                this.$emit('del_company',this.item); 
            }
        },
        
    }

</script>


