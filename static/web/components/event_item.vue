<template>
     <tr :id="id_string(item.event_id)">
         <td>{{item.aevent_id}}</td>
         <th>{{item.project.project_name}}</th>
         <td>{{item.indicator.indicator_name}}</td>
         <td>{{item.event_time}}</td>
         <td><span class="label label-success">{{item.level}}</span></td>
     </tr>
</template>

<script>
    export default {
        props:['item','index'],
        methods:{
            id_string:function(id){
                return "event-"+id
            },
            solve_event:function(){

            }
        }
        
    }

</script>


