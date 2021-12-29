$(function() {
    $(".channel").click(function(){
        var that = this;
        $(".channel-name").text("...wait");
        $.get( "/stream?play="+this.id+"&seek="+this.getAttribute("seek"), function() {
            $(".channel-name").text(that.getAttribute("channel"));
            $("#player").trigger('load');
        });
    });

    var socket = io();
    socket.on('connect', function(){
        // Send an initial message
        setInterval( function(){socket.emit('Hi')}, 10000);
    });
});