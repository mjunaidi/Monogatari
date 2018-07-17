import { Action } from '../Action';
import { Monogatari } from '../monogatari';
import { $_ } from '@aegis-framework/artemis';

export class Hide extends Action {

	static matchString ([ action ]) {
		return action === 'hide';
	}

	constructor ([ action, asset, ...classes ]) {
		super ();
		this.asset = asset;

		if (typeof Monogatari.character (this.asset) !== 'undefined') {
			this.element = $_(`[data-character="${this.asset}"]`);
		} else {
			this.element = $_(`[data-image="${this.asset}"]`);
		}

		if (typeof classes !== 'undefined') {
			this.classes = classes;
		} else {
			this.classes = [];
		}

	}


	apply () {
		if (this.classes.length > 0) {
			for (const newClass of this.classes) {
				this.element.addClass (newClass);
			}
			this.element.data ('visibility', 'invisible');
		} else {
			this.element.remove ();
		}
		return Promise.resolve ();
	}

	didApply () {
		return Promise.resolve (true);
	}

	willRevert () {
		if (typeof Monogatari.character (this.asset) !== 'undefined' && Monogatari.setting ('CharacterHistory').length > 0) {
			this.history = 'CharacterHistory';
		} else if (typeof Monogatari.asset ('images', this.asset) !== 'undefined' && Monogatari.setting ('ImageHistory').length > 0) {
			this.history = 'ImageHistory';
		} else {
			return Promise.reject ();
		}
		return Promise.resolve ();
	}

	revert () {
		$_('#game').append (Monogatari.setting (this.history).pop ());
		return Promise.resolve ();
	}

	didRevert () {
		return Promise.resolve (true);
	}
}

Hide.id = 'Hide';

Monogatari.registerAction (Hide);