import Vue from 'vue/dist/vue.js'
import VueResource from 'vue-resource';
Vue.use(VueResource);


import { config } from './common.js'

(function(global){
    

    var root = new Vue({
        el:'#update-company-section',
        data:{
            company_id:"",
            company_name:"",
            company_image:"",
            company_desc:"",
            leader_id : "",
            contact_id: "",
            create_user_id:"",
            error_msg: ""
        },
        http:{
            emulateJSON: true,
            emulateHTTP: true
        },
        created:function(){
            this.company_id = config.GetURLParameter('company_id');
            this.get_company_info();
        
        },
        methods:{
            validate_input:function(){
                var notNull = true;
                var _m = this;
                $('#update-company-box [required]').each(function(){
                    if($.AdminLTE.utils.isNull($(this).val())){
                        notNull = false;  
                        $(this).addClass('validate-alert');
                        _m.error_msg = $(this).attr('data-error_msg');
                    }
                }); 
                return notNull;
            },
            get_company_info:function(){
                this.$http.get('/get_company_info',{
                    params:{
                        company_id:this.company_id
                    }
                }).then(function(res){
                    var _m = this;
                    var r = config.parsebody(res.body,function(result){
                        var c = result.company_info;
                        _m.company_name = c.company_name;
                        _m.company_desc = c.company_desc;
                        _m.company_image = c.company_image;
                        _m.leader_id = c.leader.user_id;
                        _m.contact_id = c.contact.user_id;
                        _m.create_user_id = c.create_user.user_id;
                        for( var index in c.committee){
                            var o = c.committee[index]; 
                            $('#participant-select').multiselect('select',o.user_id);
                        } 
                    })
                })

            },
            edit_company:function(){
                if(!this.validate_input()){
                    return ;
                }

                var participant = $('#participant-select').val();
                if( !(participant && participant.length > 0)){
                    alert('请输入公司参与人');
                }
                $('#update-company-box .overlay').show();
                var data = {
                    company_id:this.company_id,
                    company_name:this.company_name,
                    company_desc:this.company_desc,
                    company_image:this.company_image,
                    leading_official:this.leader_id,
                    contact:this.contact_id,
                    participant:JSON.stringify(participant),
                    create_user_id:this.create_user_id
                }
                this.$http.post('/update_company',data
                ).then(function(r){
                    console.log(r.body);
                    $('#update-company-box .overlay').hide();
                    var r = config.parsebody(r.body,function(result){
                        localStorage.removeItem('sidebar_current_content');
                        window.onbeforeunload = null;
                        window.location.href='/company_info?company_id='+result.company_info.company_id;
                    });
                }) 
            }
        },


    
    });

    window.set_root_image = function(url){
     
        root.company_image = url;
    };
    
    $('#participant-select').multiselect({
        includeSelectAllOption: true,
        enableFiltering: true,
        buttonWidth: '100%',
        nonSelectedText: '请选择相关参与人',
        numberDisplayed: 10,
        selectAllText: '全选',
        allSelectedText: '已选择所有人'

    });
    init_upload_crop_pic_model('crop-company-cover-modal','company-cover-file-input','InputCompanyCoverUrl','company',200,134,set_root_image);

    $('#people-charge-select').change(function(){
        var val = $(this).val();
        if (val == 'new_leader'){
            window.location.href = '/edit_user'; 
        }
    });

    $('#people-contact-select').change(function(){
        var val = $(this).val();
        if (val == 'new_contact'){
            window.location.href = '/edit_user'; 
        }
    });



})(this);

