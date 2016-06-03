(function() {
    "use strict";

    return {
        init: function(elevators, floors) {
            var elevator = elevators[0]; // Let's use the first elevator

            // Whenever the elevator is idle (has no more queued destinations) ...
            elevator.on("idle", function() {
                // let's go to all the floors (or did we forget one?)
                if (this.destinationDirection == 'up') {
                    this.goToFloor(this.currentFloor() - 1);
                }
                if (this.destinationDirection == 'down') {
                    this.goToFloor(this.currentFloor() - 1);
                }
                elevator.goToFloor(0);
                elevator.goToFloor(1);
                elevator.goToFloor(2);
            });
        },
        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
    }
})();