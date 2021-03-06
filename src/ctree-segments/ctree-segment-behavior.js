/**
@license
Copyright (c) 2017 Foundation For an Innovative Future (InnovativeFuture.org)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or any
later version.

Foundation For an Innovative Future reserves the right to release the
covered work, in part or in whole, under a different open source
license and/or with specific copyleft exclusions.  Such a release
would not invalidate the license for this project, although the
project released with a modified license would not be considered
part of this covered work or subject to the copyleft portions of this
license even if the projects are identical.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

Please email contact@innovativeFuture.org for inquiries related to
this license.
*/
import '@polymer/polymer/polymer-legacy.js';

import { microTask } from '@polymer/polymer/lib/utils/async.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

/**
 * Object containing all segment components, by component name.  This is useful
 * for procedurally accessing static methods for a component type.  Commonly
 * implemented static methods are documented below.
 */
if (!window.CTreeSegments) {
  window.CTreeSegments = {};
}

/**
 * static getText(data)
 *
 * Gets text interpretation of data for segment type.  If no text interpretation
 * is possible this function may not be defined or may return an undefined
 * result.
 *
 * @param  {Object} data Segment type specific data to get text interpretation for
 * @return {String}      Text interpretation of data
 */

// Create my namespace, if it doesn't exist
if (!window.CTree) {
  window.CTree = {};
}

CTree.SegmentBehavior = class extends PolymerElement {
  /**
   * Notify segment container that a new variation should be added.
   *
   * @event add-segment-variation
   * @param {{data: variationData}} detail New segment variation data.
   */

  static get properties() {
    return {
      data: Object,

      editing: {
        type: Boolean,
        value: false,
        notify: true,
      },

      validChangeMade: {
        type: Boolean,
        value: false,
      },

      loadingChangeMade: {
        type: Boolean,
        value: false,
      },

      heightPercent: String,

      scale: {
        type: String,
        value: '100%',
      },

      _editUpdateDelay: {
        type: Number,
        value: 800,
      },

      __editUpdateHandle: Number,
    };
  }

  _addSegmentVariation(data) {
    if (!this.validChangeMade) return;

    this.validChangeMade = false;
    // TODO: prompt user to select reason for new segment (list of default reasons from behavior & custom reasons from type)
    // TODO: may be able to remove this once saving variation to loader
    this.dispatchEvent(new CustomEvent('add-segment-variation', {detail: {data: data}, bubbles: true, composed: true}));
  }

  _delayEditUpdate() {
    microTask.cancel(this.__editUpdateHandle);
    this.__editUpdateHandle = microTask.run(() => {
      this.__editUpdateHandle = undefined;
      this._editUpdate();
    }, this._editUpdateDelay);
  }

  _cancelEditUpdate() {
    microTask.cancel(this.__editUpdateHandle);
  }

  _editUpdate() {
    // TODO: override to add custom logic when edit update timer elapsed
  }
};
