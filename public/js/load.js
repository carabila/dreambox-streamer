$(function() {
    var seek = 0;
    var url = "";

    $(".channel").click(function(){
        seek = 0;
        var that = this;
        $(".channel-name").text("...wait");
        url = "/stream?url="+this.id+"&ref="+this.getAttribute("ref");
        $.get(url+"&seek=0", function() {
            $(".channel-name").text(that.getAttribute("channel"));
            $("#player").trigger('load');
        });
    });

    $(".pwd-cmd").click(function(){
        var that = this;

        switch(this.id){
            case "frev":
                seek -= (seek)?600:0;
                break;
            case "rev":
                seek -= (seek)?60:0;
                break;
            case "fwd":
                seek += 60;
                break;
            case "ffwd":
                seek += 600;
                break;
        }

        var channel = $(".channel-name").text();
        $(".channel-name").text("...wait");
        $.get(url+"&seek="+seek, function() {
            $(".channel-name").text(channel);
            $("#player").trigger('load');
        });
    });


    var socket = io();
    // socket.on('connect', function(){
    //     // Send an initial message
    //     setInterval( function(){socket.emit('Hi')}, 10000);
    // });
});
