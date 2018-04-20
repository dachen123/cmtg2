<template>
     <tr :id="id_string(item.aevent_id)" style="cursor:pointer;">
        <td v-if="can_selected">
            <input v-model="is_checked" type="checkbox"></input>
        </td>
         <td v-on:click="redirect_avent_info" >{{item.aevent_id}}</td>
         <td>{{item.company_name}}</td>
         <th>{{item.project.project_name}}</th>
         <td>{{item.indicator.indicator_name}}</td>
         <td>{{format_time(item.event_time)}}</td>
         <td v-on:click="redirect_avent_info" ><span class="label label-success">{{item.level}}</span></td>
         <td v-on:click="redirect_avent_info" >
             <span v-if="item.status==='unsend'" class="label label-primary">未解决</span>
             <span v-else-if="item.status==='unsolved'" class="label label-primary">未解决</span>
             <span v-else-if="item.status==='unverified'" class="label label-danger">待审核</span>
             <span v-else-if="item.status==='solved'" class="label label-success">已解决</span>
         </td>
     </tr>
</template>

<script>
    export default {
        props:['item','index','can_selected'],
        data:function(){
            return{
                is_checked:false,
            }
        },
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


