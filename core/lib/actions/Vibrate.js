import { Action } from '../Action';
import { Monogatari } from '../monogatari';

export class Vibrate extends Action {

	static matchString ([ action ]) {
		return action === 'vibrate';
	}

	constructor ([ action, ...time ]) {
		super ();

		// First check if vibration is available available
		if (navigator) {
			if (navigator.vibrate) {
				this.time = time;
			} else {
				console.error ('Vibration is not supported in this platform.');
			}
		} else {
			console.error ('Vibration is not supported in this platform.');
		}
	}

	willApply () {
		if (typeof this.time !== 'undefined') {
			return Promise.resolve ();
		}
		return Promise.reject ();
	}

	apply () {
		navigator.vibrate (0);
		navigator.vibrate (this.time);
		return Promise.resolve ();
	}

	didApply () {
		return Promise.resolve (true);
	}

	didRevert () {
		return Promise.resolve (true);
	}
}

Vibrate.id = 'Vibrate';
Vibrate.settings = {
	notifications: {}
};

Monogatari.registerAction (Vibrate);