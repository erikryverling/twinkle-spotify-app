require([ '$api/models'], function(models) {
    'use strict';

    var doStar = function() {
        var DEFAULT_URL = "ws://localhost:9000";

        var STAR_REQUEST_MESSAGE = "twinkle:star";
        var ERROR_MESSAGE = "twinkle:error";
        var STARRED_MESSAGE = "twinkle:starred";

        models.application.load('arguments').done(function(application) {
            var argv = application.arguments;
            var url = DEFAULT_URL;

            if (argv.length > 0) {
                if (argv.length !== 3) {
                    console.log("Wrong number of arguments. Specify the custom web socket url as follows [scheme]:[host]:[port] (ex: ws:localhost:4711)");
                    console.log("Arguments recived: " + argv);
                } else {
                    url = argv[0] + "://" + argv[1] + ":" + argv[2];
                    console.log("Using custom url: " + url);
                }
            }

            document.getElementById('url').innerHTML = url;
            var statusNode = document.getElementById('status');

            try {
                var webSocket = new WebSocket(url);

                webSocket.onopen = function () {
                    console.log("Socket opened");
                    statusNode.innerHTML = "Connected";
                    statusNode.className = "success";
                };

                webSocket.onclose = function () {
                    console.log("Socket closed");
                    statusNode.innerHTML = "Not connected";
                    statusNode.className = "error";
                };

                webSocket.onerror = function (message) {
                    console.log("Socket error: " + message);
                    statusNode.innerHTML = "Error";
                    statusNode.className = "error";
                };

                webSocket.onmessage = function (message) {
                    if(message.data === STAR_REQUEST_MESSAGE) {
                        models.player.load('track').done(function(player) {
                            var track = player.track;

                            if(track !== null) {
                                track.star();
                                console.log("Starred: " + track.name);
                                webSocket.send(STARRED_MESSAGE);
                            } else {
                                console.log("Could not star the current track");
                                webSocket.send(ERROR_MESSAGE);
                            }

                        });
                    }
                };

            } catch (exception) {
                console.log("Exception: " + exception);
            }
        });
    };
    exports.doStar = doStar;
});
