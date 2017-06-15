<template>
    <!-- chat item -->
    <div :id="id_string(item.aevent_id)" class="item">
        <img :src="item.solver.image" alt="user image" class="online">

        <div class="message ">
            <span >
                {{item.solver.name}}
            </span>
            <div class="pull-right dropdown" v-if="item.status === 'unverified'">
                <a class="btn-xs btn-danger my-audit-btn dropdown-toggle" style="border:0px;cursor:pointer;" data-toggle="dropdown">审核</a>
                <ul  class="dropdown-menu" style="min-width:0px;">
                    <li><a v-on:click.prevent="verify_pass" href="#">通过</a></li>
                    <li><a v-on:click.prevent="verify_reject" href="#">驳回</a></li>
                </ul>
            </div>
            <div class="pull-right dropdown" v-else-if="item.status === 'unsolved'">
                <label class="label label-primary">未通过</i></label>
            </div>
            <div class="pull-right dropdown" v-else-if="item.status === 'solved'">
                <label class="label label-success">已通过</i></label>
            </div>
            <p>
               {{item.description}}
            </p>
        </div>
    </div>
    <!-- /.item -->
    
</template>

<script>
    export default {
        props:['item','index'],
        methods:{
            id_string:function(id){
                return "aevent-"+id
            },
            verify_pass:function(){
                if(confirm('确认通过?')){
                    this.$emit('verify_aevent',this.item,'true'); 
                }
            
            },
            verify_reject:function(){
                if(confirm('确认驳回?')){
                    this.$emit('verify_aevent',this.item,'false'); 
                }
            
            },
        },
        
    }

</script>


