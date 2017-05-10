
var urllib = OSS.urllib;
var OSS = OSS.Wrapper;
function init_upload_crop_pic_model(modal_id,input_id,result_id,pic_type,width,height){ 
    var $uploadCrop; 
    var appServer = $(location).attr('protocol') + '//' + $(location).attr('host') +'/get_oss_token';
    //var appServer = 'http://106.39.77.133:13389/get_oss_token';
    var bucket = 'huntianyi';
    var region = 'oss-cn-beijing';
    var upload_key='';
    var STS = OSS.STS;
    var files = null;
    var crop_blob_file = null;
    // var ori_url = ""; 
    function readFile(input) { 
        if (input.files && input.files[0]) { 
            var reader = new FileReader(); 
            files = input.files;

            reader.onload = function (e) { 
                // ori_url = e.target.result;
                $uploadCrop.croppie('bind', { 
                    url: e.target.result 
                }); 
            } 

            reader.readAsDataURL(input.files[0]); 
        } 
        else { 
            alert("获取不到图片，可能是您取消上传或是浏览器不支持裁剪"); 
            $('#'+modal_id).modal('hide');
        } 
    } 

    $uploadCrop = $('#'+modal_id+' #upload-demo').croppie({ 
        viewport: { 
            width: width, 
            height: height, 
            type: 'square' 
        }, 
        boundary: { 
            width: 300, 
            height: 300 
        } 
    }); 

    $('#'+input_id).on('change', function () {  
        $("#"+modal_id+" .crop").show(); 
        readFile(this);  
        // $('#upload-demo').croppie('bind',{
        //     url:ori_url 
        // });
    }); 
    $('#'+modal_id+' #execute-crop').on('click', function (ev) { 
        $uploadCrop.croppie('result', 'blob').then(function (resp) { 
            crop_blob_file = resp;
            // popupResult({ 
            //     src: resp 
            // }); 

            // applyTokenDo(uploadFile);
            applyTokenDo(check_id_crop_and_upload);
        }); 
    }); 

    // $('#get-pic-btn').on('click',function(){
    //     initpopup() 
    // });
    $('#'+input_id).on('click',function(){
        initpopup() 
    });

    function popupResult(result) { 
        // var html; 
        // if (result.html) { 
        //     html = result.html; 
        // } 
        // if (result.src) { 
        //     html = '<img src="' + result.src + '" />'; 
        // } 
        // $("#"+result_id).val(result.src); 
    } 

    function initpopup(){
        $('#'+modal_id).modal('show');


    }

    var progress = function (p) {
        return function (done) {
            // var bar = document.getElementById('progress-bar');
            // bar.style.width = Math.floor(p * 100) + '%';
            // bar.innerHTML = ;
            $("#"+modal_id+' #crop-result').val('上传进度：'+Math.floor(p * 100) + '%'); 
            done();

        }
    };

    var uploadFile = function (client) {
        // var file = document.getElementById('crop-result').value;
        // var key = 'img/aaa.jpg';
        return client.multipartUpload(upload_key, new File([crop_blob_file],"crop.png"),{progress:progress}).then(function (res) {
            console.log('upload success: %j', res);
            $('#'+modal_id).modal('hide');
            if (res.url){
                $("#"+result_id).val(res.url); 
            }
            else{
                $("#"+result_id).val('http://'+bucket+'.'+region+'.aliyuncs.com/'+res.name); 
            }
            return res;
        });
    };

    var uploadOriFile = function (client) {
        // var file = document.getElementById('crop-result').value;
        // var key = 'img/aaa.jpg';
        return client.multipartUpload(upload_key, files[0],{progress:progress}).then(function (res) {
            console.log('upload success: %j', res);
            $('#'+modal_id).modal('hide');
            if (res.url){
                $("#"+result_id).val(res.url); 
            }
            else{
                $("#"+result_id).val('http://'+bucket+'.'+region+'.aliyuncs.com/'+res.name); 
            }
            return res;
        });
    };

    var check_id_crop_and_upload = function (client){
        $("#"+modal_id+' #crop-result').val('上传进度：0%'); 
        if($('#'+modal_id+' #is-crop').is(':checked')){
            uploadFile(client); 

        }
        else{
            uploadOriFile(client);
        }

    }

    var applyTokenDo = function (func) {
        var url = appServer;
        $.ajax({ 
            type: "GET", 
            url: appServer, 
            data:{'pic_type':pic_type},
            dataType: "json", 
            beforeSend: function(){ 
            }, 
            success: function(json){ 
                if (json.error_code == "OK"){
                    upload_key = json.result.upload_key;
                    var client = new OSS({
                        region: region,
                        accessKeyId: json.result.access_key_id,
                        accessKeySecret: json.result.access_key_secret,
                        stsToken: json.result.security_token,
                        bucket: bucket
                    });
                    return func(client);
                }
                else
                    alert(JSON.stringify(json.message));
            },
            error:function(){alert("错误：");}
        }); 

    };
} 



