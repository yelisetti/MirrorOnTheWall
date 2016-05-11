(function(angular) {
    'use strict';

    function MirrorCtrl(
            AnnyangService, 
            GeolocationService, 
            WeatherService, 
            MapService, 
            HueService,
            CalendarService,
            SearchService,
            $scope,
            $http,
            $timeout, 
            $interval) {
                
        var _this = this;
        var DEFAULT_COMMAND_TEXT = 'Say "help"...';
        $scope.listening = false;
        $scope.debug = false;
        $scope.complement = "What's cooking, good looking?"
        $scope.focus = "default";
        $scope.user = {};
        $scope.interimResult = DEFAULT_COMMAND_TEXT;

        //Update the time
        function updateTime(){
            $scope.date = new Date();
        }

        // Reset the command text
        var restCommand = function(){
          $scope.interimResult = DEFAULT_COMMAND_TEXT;
        }

        _this.init = function() {
            var tick = $interval(updateTime, 1000);
            updateTime();
            $scope.map = MapService.generateMap("Minneapolis,MN");
            _this.clearResults();
            restCommand();

            //Initiate Hue communication
            HueService.init();

            var refreshMirrorData = function() {
                //Get our location and then get the weather for our location
                GeolocationService.getLocation({enableHighAccuracy: true}).then(function(geoposition){
                    console.log("Geoposition", geoposition);
                    WeatherService.init(geoposition).then(function(){
                        $scope.currentForcast = WeatherService.currentForcast();
                        $scope.weeklyForcast = WeatherService.weeklyForcast();
                        console.log("Current", $scope.currentForcast);
                        console.log("Weekly", $scope.weeklyForcast);
                    });
                }, function(error){
                    console.log("There was a problem:", error);
                });

                CalendarService.renderAppointments().then(function(response) {
                    $scope.calendar = CalendarService.getFutureEvents();
                }, function(error) {
                    console.log(error);
                });
            };

            $timeout(refreshMirrorData(), 3600000);

            //Set the mirror's focus (and reset any vars)
            var setFocus = function(target){
                $scope.focus = target;
                //Stop any videos from playing
                if(target != 'video'){
                    $scope.video = 'http://www.youtube.com/embed/';
                }
                console.log("Video URL:", $scope.video);
            }

            var defaultView = function() {
                console.debug("Ok, going to default view...");
                setFocus("default");
            }

            // List commands
            AnnyangService.addCommand('help', function() {
                console.debug("Here is a list of commands...");
                console.log(AnnyangService.commands);
                setFocus("commands");
            });

            // Go back to default view
            AnnyangService.addCommand('Go Home', defaultView);

            // Hide everything and "sleep"
            AnnyangService.addCommand('Go to Sleep', function() {
                console.debug("Ok, going to sleep...");
                setFocus("sleep");

                //window.alert("hello");
                $http({
                    url: 'http://things.ubidots.com/api/v1.6/variables/572ec449762542669c750f77/values/?token=NrYUMnW0Ug4xF5eiyHs5tVucuZWAtY',
                    method: 'POST',
                    data: {value: "0"}
                });

            });

            // Go back to default view
            AnnyangService.addCommand('Wake up', function() {
                defaultView();
                $scope.complement = 'Hello Vishal, lets get started!';

                //window.alert("hello");
                $http({
                    url: 'http://things.ubidots.com/api/v1.6/variables/572ec449762542669c750f77/values/?token=NrYUMnW0Ug4xF5eiyHs5tVucuZWAtY',
                    method: 'POST',
                    data: {value: "1"}
                });
            });

            // Hide everything and "show debug information"
            AnnyangService.addCommand('Show debug information', function() {
                console.debug("Boop Boop. Showing debug info...");
                $scope.debug = true;
            });

            // Hide everything and "sleep"
            AnnyangService.addCommand('Show (me a) map', function() {
                console.debug("Going on an adventure?");
                setFocus("map");
            });

            // Hide everything and "sleep"
            AnnyangService.addCommand('Show (me a) map of *location', function(location) {
                console.debug("Getting map of", location);
                $scope.map = MapService.generateMap(location);
                setFocus("map");
            });

            // Zoom in map
            AnnyangService.addCommand('(map) zoom in', function() {
                $scope.map = MapService.zoomIn();
            });

            AnnyangService.addCommand('(map) zoom out', function() {
                $scope.map = MapService.zoomOut();
            });

            AnnyangService.addCommand('(map) zoom (to) *value', function(value) {
                $scope.map = MapService.zoomTo(value);
            });

            //Search for a video
            AnnyangService.addCommand('show me (a video)(of)(about) *query', function(query){
                SearchService.searchYouTube(query).then(function(results){
                    //Set cc_load_policy=1 to force captions
                    $scope.video = 'http://www.youtube.com/embed/'+results.data.items[0].id.videoId+'?autoplay=1&controls=0&iv_load_policy=3&enablejsapi=1&showinfo=0';
                    $scope.focus = "video";
                });
            });

            //Stop video
            AnnyangService.addCommand('stop the video', function() {
                var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
                iframe.postMessage('{"event":"command","func":"' + 'stopVideo' +   '","args":""}', '*');
                $scope.focus = "default";
            });

            // Turn lights off -- Still need to test
            AnnyangService.addCommand('Turn the light off', function(state, action) {
                HueService.performUpdate(state + " " + action);
            });

            // Change name
            AnnyangService.addCommand('My (name is)(name\'s) *name', function(name) {
                //console.debug("Hi", name, "nice to meet you");
                $scope.complement="Hello,"+ name + ", say 'help' to get started...";
            });

            // Fallback for all commands
            AnnyangService.addCommand('*allSpeech', function(allSpeech) {
                console.debug(allSpeech);
                _this.addResult(allSpeech);
            });

            var resetCommandTimeout;
            //Track when the Annyang is listening to us
            AnnyangService.start(function(listening){
                $scope.listening = listening;
            }, function(interimResult){
                $scope.interimResult = interimResult;
                $timeout.cancel(resetCommandTimeout);
            }, function(result){
                $scope.interimResult = result[0];
                resetCommandTimeout = $timeout(restCommand, 5000);
            });
        };

        _this.addResult = function(result) {
            _this.results.push({
                content: result,
                date: new Date()
            });
        };

        _this.clearResults = function() {
            _this.results = [];
        };

        _this.init();
    }

    angular.module('SmartMirror')
        .controller('MirrorCtrl', MirrorCtrl);

}(window.angular));
