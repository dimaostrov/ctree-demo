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
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-icon-button/paper-icon-button.js';
import '../ctree-icons/ctree-icons.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class CTreeSort extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        text-align: right;
      }
    </style>

    <!-- TODO: make all buttons except order single selection like a radio group with a none selected option, reflect
      by changing background color -->
    <paper-icon-button id="time" icon="time" title="Time"></paper-icon-button>
    <paper-icon-button id="interest" icon="popular" title="Interest"></paper-icon-button>
    <paper-icon-button id="rating" icon="thumbs-up" title="Rating"></paper-icon-button>
    <!-- TODO: toggle icon up/down and update ascending property -->
    <paper-icon-button id="order" icon="sort-decending" title="Sort Decending"></paper-icon-button>
`;
  }

  static get is() { return 'ctree-sort'; }

  static get properties() {
    return {
      type: {
        type: String,
        notify: true,
      },

      ascending: {
        type: Boolean,
        notify: true,
      },
    };
  }
}

// Register custom element definition using standard platform API
customElements.define(CTreeSort.is, CTreeSort);
