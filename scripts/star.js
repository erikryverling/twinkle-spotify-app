require([ '$api/models'
        ], function(models) {
            'use strict';

            var doStar = function() {
                try {
                    var DEFAULT_URL = "ws://localhost:9000";

                    var STAR_REQUEST_MESSAGE = "twinkle:star";
                    var ERROR_MESSAGE = "twinkle:error";
                    var STARRED_MESSAGE = "twinkle:starred";

                    var url = DEFAULT_URL;

                    var argv = [];
                    models.application.load('arguments').done(function() {
                        argv = models.application.arguments;
                    });

                    if (argv.length > 0) {
                        if (argv.length !== 3) {
                            console.log("Wrong number of arguments. Specify the custom web socket url as follows [scheme]:[host]:[port] (ex: ws:localhost:4711)");
                            console.log("Arguments recived: " + argv);
                        } else {
                            url = argv[0] + "://" + argv[1] + ":" + argv[2];
                            console.log("Using custom url: " + url);
                        }
                    }

                    var webSocket = new WebSocket(url);
                    document.getElementById('url').innerHTML = url;

                    var statusNode = document.getElementById('status');

                    webSocket.onopen = function (e) {
                        console.log("Socket opened");
                        statusNode.innerHTML = "Connected";
                        statusNode.className = "success";
                    };

                    webSocket.onclose = function (e) {
                        console.log("Socket closed");
                        statusNode.innerHTML = "Not connected";
                        statusNode.className = "error";
                    };

                    webSocket.onerror = function (e) {
                        console.log("Socket error: " + e);
                        statusNode.innerHTML = "Error";
                        statusNode.className = "error";
                    };

                    webSocket.onmessage = function (e) {
                        if(e.data === STAR_REQUEST_MESSAGE) {
                            // TODO Could we avoid null?
                            var track = null;
                            models.player.load('track').done(function() {
                                track = models.player.track;
                            });

                            if(track !== null) {
                                track.star();
                                console.log("Starred: " + track.name);
                                webSocket.send(STARRED_MESSAGE);
                            } else {
                                console.log("Could not star the current track");
                                webSocket.send(ERROR_MESSAGE);
                            }
                        }
                    };

                } catch (ex) {
                    console.log("Exception: " + ex);
                }
            };
            exports.doStar = doStar;
        });
