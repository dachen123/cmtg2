var config = {};

var match1s = window.location.hostname.match(/upupapp.cn/);
var match2s = window.location.hostname.match(/lumbar.cn/);
if (match1s){
    config.server_domain = '/cm';
}
else if(match2s){
    config.server_domain = '/cm';
}
else{
    config.server_domain = 'http://localhost:5000';
}

config.GetURLParameter = function(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}

config.parsebody = function(body){
    if(body.error_code != 'OK'){
        alert(body.message); 
        console.log(body.message); 
    }
    return body.result
}

//寻找层级
$(function(){
    localStorage.setItem('sidebar_content',$('ul.sidebar-menu').html());
    $('body').on('click','.treeview, .treeview-menu>li',function(){
        //可以通过event.target判断事件是来自绑定元素触发或是冒泡产生
        //event.target在冒泡过程永远不会改变
        if($(event.target).closest('li')[0]==$(this)[0]){
            var ul_list = $(this).parents('.treeview-menu, .sidebar-menu');
            console.log(ul_list.length);
            //复制导航栏代码
            if( ul_list.length == 6){
                $(event.target).closest('li').addClass('active');
                $(event.target).closest('li').find('ul:first').addClass('menu-open');
                $(event.target).closest('li').find('ul:first').css('display','block');
                var tree_ul = $(this).closest('.treeview-menu, .sidebar-menu');
                var new_ul = tree_ul.html(); 
                var li_name = tree_ul.closest('li').find('.a-span').html();
                $('ul.sidebar-menu').html(new_ul);
                $('ul.sidebar-menu').children('li').addClass('treeview');
                // $('ul.sidebar-menu').append('<li><button class="level-up">'+li_name+'</button></li>');
                $('div.level-up').remove();
                $('div.user-panel').after('<div class="level-up" '
                        +'style="padding:10px; color:#fff;background:#1e282c'
                        +';cursor:pointer;"><span style="font-size:15px;">'
                        +'<i class="fa  fa-angle-double-up" style="margin-right:10px;">'
                        +'</i>'+li_name+'</span></div>'
                        );

            }
        }
    });
    $('body').on('click','.level-up',function(){
        //重置侧边导航
        var sidebar = localStorage.getItem('sidebar_content');
        var first_node_id = $('ul.sidebar-menu').children('li:first').attr('id');
        $('ul.sidebar-menu').html(sidebar);
        var li = $('#'+first_node_id);
        for (var i=0;i<5;i++){
            li.parents('li:first').addClass('active');
            li.parents('li:first').find('ul:first').addClass('menu-open');
            li.parents('li:first').find('ul:first').css('display','block');
            li = li.parents('li:first');
        }
        var tree_ul = li.closest('.treeview-menu, .sidebar-menu');
        var new_ul = tree_ul.html(); 
        var li_name = tree_ul.closest('li').find('.a-span').html();
        $('ul.sidebar-menu').html(new_ul);
        $('ul.sidebar-menu').children('li').addClass('treeview');
        // $('ul.sidebar-menu').append('<li><button class="level-up">向上</button></li>');
        $('div.level-up').remove();
        if( li_name ){
            $('div.user-panel').after('<div class="level-up" '
                    +'style="padding:10px; color:#fff;background:#1e282c'
                    +';cursor:pointer;"><span style="font-size:15px;">'
                    +'<i class="fa  fa-angle-double-up" style="margin-right:10px;">'
                    +'</i>'+li_name+'</span></div>'
                    );
        }


    });


    //cas
    function cascader(cascader_div, output){
        $(cascader_div+"  .dropdown-menu > li > a.trigger").on("click",function(e){
            var current=$(this).next();
            var grandparent=$(this).parent().parent();
            if($(this).hasClass('left-caret')||$(this).hasClass('right-caret'))
                $(this).toggleClass('right-caret left-caret');
            grandparent.find('.left-caret').not(this).toggleClass('right-caret left-caret');
            grandparent.find(".sub-menu:visible").not(current).hide();
            current.toggle();
            var path = [];
            $(this).parentsUntil($("ul.dropdown-toggle"),"li").each(function(){
                // console.log(); 
                path.push($(this).find('a').html());
            });
            path = path.reverse();
            $(output).val(path.join('/'));
            e.stopPropagation();
            return false;
        });
        $(cascader_div+"  .dropdown-menu > li > a:not(.trigger)").on("click",function(e){
            var root=$(this).closest('.dropdown');
            root.find('.left-caret').toggleClass('right-caret left-caret');
            root.find('.sub-menu:visible').hide();
            root.find('a:first').trigger('click');
            var path = [];
            $(this).parentsUntil($("ul.dropdown-toggle"),"li").each(function(){
                // console.log($(this).find('a').html()); 
                path.push($(this).find('a').html());
            });
            path = path.reverse();
            $(output).val(path.join('/'));
            e.stopPropagation();
            return false;
        });
    }



});

export {
    config,
    init_upload_crop_pic_model,
}
