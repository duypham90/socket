"use strict"
const socket = io.connect();
$(document).ready(function() {
    let dest;
    socket.on('XAC_NHAN_DANG_KY',isOK => {
        if(!isOK) return alert('DANG KY THAT BAI');
    });
    socket.on('NEW_USER_CONNECTED', username => {
        $('.list-user').append(`<li id="${username}" class="user">${username}</li>`);
        $('#userName').val('');
    });
    socket.on('GOT_NEW_MESSAGE', msg => {
       console.log(msg);
    });
    socket.on('USER_DISCONECTED', username => {
        $(`#${username}`).remove();
    });
    $('#signup').click(()=>{
        var user = $('#userName').val();
        if(user.length === 0 || user == ''){
            $(this).focus();
            return false;
        }
        socket.emit('NEW_USER_SIGN_UP',user);
    });
    $('#userName').keypress(function(e) {
        var key = e.which;
        if(e==13){
            var user = $('#userName').val();
            if(user.length === 0 || user == ''){
                $(this).focus();
                return false;
            }
            socket.emit('NEW_USER_SIGN_UP',user);
        }       
    });
    $('.btnEmit').click(() => {
        dest = $('#txtFriend').val();
        const msg = $('#txtMessage').val();
         $('#txtMessage').val();
         socket.emit('CLIENT_SEND_NEW_MESSAGE', { dest, msg });
    });
    $('.user').click(function(){
        if($(this).hasClass('active')){
            return $(this).removeClass('active');
        }
        $(this).addClass('active');
        dest = $(this).text();
    });
});