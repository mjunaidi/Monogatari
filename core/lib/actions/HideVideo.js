import { Action } from '../Action';
import { Monogatari } from '../monogatari';
import { $_ } from '@aegis-framework/artemis';

export class HideVideo extends Action {


	static matchString ([ hide, type ]) {
		return hide === 'hide' && type === 'video';
	}

	constructor ([ hide, type, name, separator, ...classes ]) {
		super ();
		this.name = name;
		if (typeof classes !== 'undefined') {
			this.classes = classes;
		} else {
			this.classes = [];
		}
	}

	apply () {

		if (this.classes.length > 0) {
			$_(`${Monogatari.selector} [data-video="${this.name}"]`).addClass ('animated');
			for (const newClass of this.classes) {
				$_(`${Monogatari.selector} [data-video="${this.name}"]`).addClass (newClass);
			}

			// Remove item after a while to prevent it from showing randomly
			// when coming from a menu to the game because of its animation
			setTimeout (() => {
				$_(`${Monogatari.selector} [data-video="${this.name}"]`).remove ();
			}, 10000);
		} else {
			$_(`${Monogatari.selector} [data-video="${this.name}"]`).remove ();
		}

		for (let i = Monogatari.state ('videos').length - 1; i >= 0; i--) {
			const last = Monogatari.state ('videos')[i];
			const [show, video, mode, name] = last.split (' ');
			if (name === this.name) {
				Monogatari.state ('videos').splice (i, 1);
				break;
			}
		}

		return Promise.resolve ();
	}

	didApply () {
		return Promise.resolve (true);
	}

	revert () {
		for (let i = Monogatari.history ('video').length - 1; i >= 0; i--) {
			const last = Monogatari.history ('video')[i];
			const [show, video, mode, name] = last.split (' ');
			if (name === this.name) {
				Monogatari.history ('video').splice (i, 1);
				return Monogatari.run (last, false);

			}
		}
		return Promise.resolve ();
	}

	didRevert () {
		return Promise.resolve (true);
	}
}

HideVideo.id = 'Hide::Video';

Monogatari.registerAction (HideVideo);