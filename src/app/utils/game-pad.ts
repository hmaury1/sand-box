export class GamePad {

    static getButton(code): GamepadButton {
        let gamepads = navigator.getGamepads();
        if (gamepads[0] != null) {
            let gp = gamepads[0];
            return gp.buttons[code];
        }
        return null;
    }

    static getAxes(code): number {
        let gamepads = navigator.getGamepads();
        if (gamepads[0] != null) {
            let gp = gamepads[0];
            return GamePad.setDeadzone(gp.axes[code]);
        }
        return null;
    }

    static getState() {
        // Get the state of all gamepads
        let gamepads = navigator.getGamepads();

        for (let i = 0; i < gamepads.length; i++) {
            console.log("Gamepad " + i + ":");

            if (gamepads[i] === null) {
                console.log("[null]");
                continue;
            }

            if (!gamepads[i].connected) {
                console.log("[disconnected]");
                continue;
            }

            console.log("    Index: " + gamepads[i].index);
            console.log("    ID: " + gamepads[i].id);
            console.log("    Axes: " + gamepads[i].axes.length);
            console.log("    Buttons: " + gamepads[i].buttons.length);
            console.log("    Mapping: " + gamepads[i].mapping);
        }
    }

    static setDeadzone(v) {
        // Anything smaller than this is assumed to be 0,0
        const DEADZONE = 0.2;

        if (Math.abs(v) < DEADZONE) {
            // In the dead zone, set to 0
            v = 0;

        } else {
            // We're outside the dead zone, but we'd like to smooth
            // this value out so it still runs nicely between 0..1.
            // That is, we don't want it to jump suddenly from 0 to
            // DEADZONE.

            // Remap v from
            //    DEADZONE..1 to 0..(1-DEADZONE)
            // or from
            //    -1..-DEADZONE to -(1-DEADZONE)..0

            v = v - Math.sign(v) * DEADZONE;

            // Remap v from
            //    0..(1-DEADZONE) to 0..1
            // or from
            //    -(1-DEADZONE)..0 to -1..0

            v /= (1.0 - DEADZONE);

            return v;
        }
    }

    static supportsGamepads() {
        // Return true if gamepad support exists on this browser
        return !!(navigator.getGamepads);
    }

    static testForConnections = (function () {

        // Keep track of the connection count
        let connectionCount = 0;

        // Return a function that does the actual tracking
        return function () {
            let gamepads = navigator.getGamepads();
            let count = 0;
            let diff;

            for (let i = gamepads.length - 1; i >= 0; i--) {
                let g = gamepads[i];

                // Make sure they're not null and connected
                if (g && g.connected) {
                    count++;
                }
            }

            // Return any changes
            diff = count - connectionCount;

            connectionCount = count;

            return diff;
        }
    }())
}