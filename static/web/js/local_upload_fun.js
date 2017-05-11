// var uploader = new plupload.Uploader({
//     runtimes : 'html5,flash,silverlight,html4',
//
//     // browse_button : 'pickfiles', // you can pass in id...
//     // container: document.getElementById('container'), // ... or DOM Element itself
//
//     url : "/upload_image",
//
//     multipart_params: {
//         classify: 'test',
//     },
//
//     // filters : {
//     //     max_file_size : '10mb',
//     //     mime_types: [
//     //     {title : "Image files", extensions : "jpg,gif,png"},
//     //     ]
//     // },
//
//     // Flash settings
//     flash_swf_url : '/static/web/plugins/plupload/Moxie.swf',
//
//     // Silverlight settings
//     silverlight_xap_url : 'static/web/plugins/plupload/Moxie.xap',
//
//
//     init: {
//         // PostInit: function() {
//         //     document.getElementById('filelist').innerHTML = '';
//         //
//         //     document.getElementById('uploadfiles').onclick = function() {
//         //         uploader.start();
//         //         return false;
//         //     };
//         // },
//
//         FilesAdded: function(up, files) {
//             // plupload.each(files, function(file) {
//             //     document.getElementById('filelist').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
//             // });
//             
//             //显示添加进来的文件名
//             $.each(files, function(key, value){
//                 console.log('添加文件' + value.name);
//             });
//
//             // 文件添加之后，开始执行上传
//             uploader.start();
//         },
//
//         UploadProgress: function(up, file) {
//         },
//
//         Error: function(up, err) {
//             // document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
//         }
//     }
// });
//
// uploader.init();
//  


function init_upload_crop_pic_model(modal_id,input_id,result_id,pic_type,width,height,callback){ 
    var $uploadCrop; 
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

            check_id_crop_and_upload();
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


    var uploadFile = function () {

        // uploader.addFile(new File([crop_blob_file],"crop.png"));
        // crop_blob_file.name = 'test.png';
        // var new_file = new plupload.File(crop_blob_file);
        // uploader.addFile(new_file,'test.png');
        var formData = new FormData();
        
        formData.append('file', new File([crop_blob_file],"crop.png"));
        formData.append('pic_type', pic_type);

        $.ajax('/upload_image', {
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (json) {
                console.log('Upload success');
                $('#'+modal_id).modal('hide');
                $("#"+result_id).val(json.result.url); 
                if (callback){
                    callback(json.result.url);
                }
            },
            error: function () {
                console.log('Upload error');
                $('#'+modal_id).modal('hide');
                $("#"+result_id).val(res.url); 
                $("#"+result_id).val(json.result.url); 
                if ( callback ){
                    callback(json.result.url);
                }
            }
        }); 
    };

    var uploadOriFile = function (client) {
        var formData = new FormData();
        
        formData.append('file', files[0]);
        formData.append('pic_type', pic_type);

        $.ajax('/upload_image', {
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                console.log('Upload success');
            },
            error: function () {
                console.log('Upload error');
            }
        }); 

        // uploader.addFile(files[0]);
    };

    var check_id_crop_and_upload = function (){
        $("#"+modal_id+' #crop-result').val('上传进度：0%'); 
        // uploader.setOption('multipart_params',{
        //     classify: pic_type,
        // });
        // uploader.settings.multipart_params = {'classify' : pic_type}; 
        if($('#'+modal_id+' #is-crop').is(':checked')){
            uploadFile(); 

        }
        else{
            uploadOriFile();
        }

    }

} 



