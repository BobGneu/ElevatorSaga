(function() {
    "use strict";

    return {
        init: function(elevators, floors) {
            elevators.forEach(function(elevator) {
                elevator.goToFloor(0);

                elevator.passengers = 0;
                elevator.passengersToFloor = {};

                for (var i = floors.length - 1; i >= 0; i--) {
                    elevator.passengersToFloor[i] = 0;
                }

                elevator.on('floor_button_pressed', function() {
                    var elevator = this;

                    console.log(elevator);

                    if (this.passengers < this.maxPassengerCount()) {
                        return;
                    }

                    var destinations = Array.from(new Set(this.getPressedFloors()));

                    if (this.destinationDirection === 'up') {
                        destinations.sort(function(a, b) {
                            if (a === b) {
                                return 0;
                            }

                            return (elevator.currentFloor() - a) - (elevator.currentFloor() - b);
                        });
                    } else {
                        destinations.sort(function(a, b) {
                            if (a === b) {
                                return 0;
                            }

                            return (elevator.currentFloor() - b) - (elevator.currentFloor() - a);
                        });
                    }

                    this.goToFloor(destinations[0]);
                });

                elevator.on('floor_button_pressed', function(floorNum) {
                    this.passengers++;
                    this.passengersToFloor[floorNum]++;
                });

                elevator.on('stopped_at_floor', function(floorNum) {
                    this.passengers -= this.passengersToFloor[floorNum];
                    this.passengersToFloor[floorNum] = 0;
                });
            });
        },
        update: function(dt, elevators, floors) {}
    }
})();