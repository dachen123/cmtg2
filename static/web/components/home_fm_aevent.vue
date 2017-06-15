<template>
    <!-- chat item -->
    <div :id="id_string(item.aevent_id)" class="item">
        <img :src="item.verifier.image" alt="user image" class="online">

        <div class="message ">
            <span >
                {{item.verifier.name}}
            </span>
            <div class="pull-right dropdown" v-if="item.status === 'unverified'">
                <label class="label label-danger">待审核</i></label>
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
        },
        
    }

</script>


