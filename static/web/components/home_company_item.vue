<template>
    <li :id="id_string(item.company_id)" class="item attachment-block ">
        <img class="attachment-img" :src="item.company_image" alt="Attachment Image">
        <div class="attachment-pushed">
            <h4 class="attachment-heading"><a :href="item.home_addr">{{item.company_name}}</a></h4>

            <div class="attachment-text">
                {{item.company_desc}}<a href="#">more</a>
            </div>
            <!-- /.attachment-text -->
        </div>
    </li>
    <!-- /.item -->

</template>

<script>
    export default {
        props:['item','index'],
        methods:{
            id_string:function(id){
                return "company-"+id
            }
        }
        
    }

</script>


