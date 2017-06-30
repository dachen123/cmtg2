<template>
    <div v-on:click="redirect_project_info" :id="id_string(item.project_id)" class="info-box">
        <!-- Apply any bg-* class to to the icon to color it -->
        <img class="info-box-icon" :src="item.image"></img>

        <div class="info-box-content">
            <h5>{{item.project_name}}</h5>
            <span class="info-box-text">{{item.project_desc}}</span>
        </div><!-- /.info-box-content -->
    </div><!-- /.info-box -->

</template>

<script>
    export default {
        props:['item','index'],
        methods:{
            id_string:function(id){
                return "pm-"+id
            },
            redirect_project_info:function(){
                window.location.href=this.item.home_addr;
            }
        },
        
    }

</script>


