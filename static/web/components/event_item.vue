<template>
     <tr v-on:click="redirect_avent_info" :id="id_string(item.aevent_id)" style="cursor:pointer;">
         <td>{{item.aevent_id}}</td>
         <th>{{item.project.project_name}}</th>
         <td>{{item.indicator.indicator_name}}</td>
         <td>{{format_time(item.event_time)}}</td>
         <td><span class="label label-success">{{item.level}}</span></td>
     </tr>
</template>

<script>
    export default {
        props:['item','index'],
        methods:{
            id_string:function(id){
                return "aevent-"+id
            },
            solve_event:function(){

            },
            format_time:function(t){
                var d = new Date(t);
                var year = d.getFullYear();
                var month = d.getMonth() + 1;
                var day = d.getDate();
                return year + '-' + month + '-' + day;
            },
            redirect_avent_info:function(){
                window.location.href="/aevent_info?aevent_id="+this.item.aevent_id;
            }
        }
        
    }

</script>


