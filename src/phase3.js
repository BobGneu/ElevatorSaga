(function() {
    "use strict";

    var requests = [];

    var getSuggestedFloor = function(currentFloor) {
        var suggestedFloor;
        var numRequesting = 0;

        requests.forEach(function(request, ndx) {
            if (request.waiting > numRequesting) {
                numRequesting = request.waiting;
                suggestedFloor = ndx;
            }
        });

        if (typeof suggestedFloor === 'undefined') {
            suggestedFloor = 0;
        }

        return suggestedFloor;
    };

    var sortFloorsForDirection = function(elevator) {
        elevator.destinationQueue = Array.from(new Set(elevator.destinationQueue));

        if (elevator.destinationDirection === 'down') {
            elevator.destinationQueue.sort(function(a, b) {
                if (requests[a].waiting === requests[b].waiting) {
                    return;
                }

                return requests[a].waiting - requests[b].waiting;
            });
        } else {
            elevator.destinationQueue.sort(function(a, b) {
                if (requests[a].waiting === requests[b].waiting) {
                    return;
                }

                return requests[b].waiting - requests[a].waiting;
            });
        }

        elevator.checkDestinationQueue();
    };

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
                    requests[this.floorNum()].waiting ++;
                });

                floor.on("down_button_pressed", function() {
                    requests[this.floorNum()].pendingDown = true;
                    requests[this.floorNum()].waiting ++;
                });
            });

            elevators.forEach(function(elevator) {
                elevator.on("idle", function() {
                    this.goToFloor(getSuggestedFloor(this.currentFloor()));
                });

                elevator.on("floor_button_pressed", function(floorNum) {
                    this.goToFloor(floorNum);
                    sortFloorsForDirection(this);
                    requests[floorNum].waiting--;
                });

                elevator.on('passing_floor', function(floorNum, direction) {
                    if (this.loadFactor() === 1) {
                        return;
                    }

                    if (direction === this.destinationDirection) {
                        elevator.goToFloor(floorNum);
                        sortFloorsForDirection(this);
                    }
                })

                elevator.on("stopped_at_floor", function(floorNum) {
                    sortFloorsForDirection(this);
                });
            });
        },
        update: function(dt, elevators, floors) {}
    }
})();