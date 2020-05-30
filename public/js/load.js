
$(function() {
    $("a").click(function(){
        var that = this;
        $(".channel").text("...wait");
        $.get( "/stream?e2servicereference="+this.id, function() {
            $(".channel").text(that.getAttribute("channel"));
            $("#player").trigger('load');
        });
    });

    var socket = io();
    socket.on('connect', function(){
        // Send an initial message
        setInterval( function(){socket.emit('Hi')}, 10000);
    });
});