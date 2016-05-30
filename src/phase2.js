(function() {
    "use strict";

    var requests = [];

    return {
        init: function(elevators, floors) {

            floors.forEach(function(floor) {
                requests[floor.floorNum()] = {
                    waiting: 0,
                    pendingUp: false,
                    pendingDown: false
                };

                floor.on("up_button_pressed", function() {
                    requests[this.floorNum()].pendingUp = true;
                });

                floor.on("down_button_pressed", function() {
                    requests[this.floorNum()].pendingDown = true;
                });
            });

            elevators.forEach(function(elevator) {
                elevator.on("idle", function () {
                    this.goToFloor(Math.floor(Math.random() * requests.length)); 
                });

                elevator.on("floor_button_pressed", function (floorNum) {
                    this.goToFloor(floorNum);
                });
            });
        },
        update: function(dt, elevators, floors) {}
    }
})();