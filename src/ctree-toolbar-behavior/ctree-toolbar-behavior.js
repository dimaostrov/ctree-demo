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

import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-toolbar/paper-toolbar.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

// Create my namespace, if it doesn't exist
if (!window.CTree) {
  window.CTree = {};
}

CTree.ToolbarBehavior = class extends PolymerElement {

  /**
   * Fired when the close button is tapped.
   *
   * @event close-tapped
   */

  static get properties() {
    return {
      /**
       * If true, don't show close button.
       */
      noclose: Boolean,

      _toggleButtonIcon: String,

      /**
       * Override to contain String icon names.
       *
       * Example value:
       *   ['icon-border', 'icon']
       */
      _toggleButtonIconNames: Array,
    };
  }

  _onToggleButton() {
    // Implement to toggle value
    //
    // Example:
    //   this._toggleValue = !this._toggleValue;
  }

  _getToggleButtonValue() {
    // Implement to return toggle value
    //
    // Example;
    //   return this._toggleValue;
    return false;
  }

  _toggleButton() {
    if (this._toggleButtonIconNames) {
      this._onToggleButton();
      this._updateToggleButtonIcon();
    }
  }

  _updateToggleButtonIcon() {
    var value = this._getToggleButtonValue();
    var isDefined = this._toggleButtonIconNames;
    var valueType = typeof value;
    if (valueType === 'boolean') {
      value = (value ? 1 : 0);
    } else if (valueType !== 'number') {
      isDefined = false;
    }
    this._toggleButtonIcon = isDefined ? this._toggleButtonIconNames[value] : '';
  }

  _showShare(button) {
    // TODO: show share dialog
  }

  _closeClicked() {
    this.dispatchEvent(new CustomEvent('close-tapped', {bubbles: true, composed: true}));
  }
};
