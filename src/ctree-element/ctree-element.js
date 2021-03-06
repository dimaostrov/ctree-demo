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

import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/iron-icon/iron-icon.js';
import '../ctree-icons/ctree-icons.js';
import '../ctree-toolbar-behavior/ctree-toolbar-behavior.js';
import '../ctree-toolbar-behavior/ctree-toolbar-shared-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class CTreeElement extends CTree.ToolbarBehavior {
  static get template() {
    return html`
    <style include="ctree-toolbar-shared-styles"></style>
    <style>
      :host {
        display: block;
      }
      .toolbar {
        --paper-toolbar-height: 48px;
        --paper-toolbar-sm-height: 48px;

        @apply --shadow-elevation-2dp;
      }
      .title {
        font-size: 16px !important;
      }
      .type-description {
        width: 180px;
      }
      .content {
        background: #fdf0bd;
        height: calc(100% - 48px);
        width: 100%;
        overflow: hidden;
      }
    </style>

    <paper-toolbar class="toolbar" style="background-color: [[headerColor]];">
      <iron-icon slot="top" id="typeIcon" src="[[element.type.iconUrl]]"></iron-icon>
      <span slot="top" class="title">[[element.title]]</span>
      <!-- TODO: see if some of the button attributes can be set by the behavior -->
      <paper-icon-button slot="top" id="bookmarkButton" icon="[[_toggleButtonIcon]]" alt="favorite" on-tap="_toggleButton"></paper-icon-button>
      <paper-icon-button slot="top" id="share" icon="share" alt="share" on-tap="_showShare"></paper-icon-button>
      <paper-icon-button slot="top" id="close" icon="close" alt="close" on-tap="_closeClicked" hidden\$="[[noclose]]"></paper-icon-button>
      <paper-tooltip slot="top" for="bookmarkButton" offset="-8">Bookmark</paper-tooltip>
      <paper-tooltip slot="top" for="share" offset="-8">Share</paper-tooltip>
      <paper-tooltip slot="top" for="close" offset="-8">Close</paper-tooltip>
      <paper-tooltip slot="top" for="typeIcon" position="right" offset="8" animation-delay="0" class="type-description">[[element.type.name]]: [[element.type.description]]</paper-tooltip>
    </paper-toolbar>
    <div class="content"><slot></slot></div>
`;
  }

  static get is() { return 'ctree-element'; }

  static get properties() {
    return {
      element: {
        type: Object,
        observer: '_elementChanged',
      },

      headerColor: {
        type: String,
        value: "#cfcfcf",
        computed: '_calculateHeaderColor(element)'
      },

      /**
       * Toggle icon names.
       */
      _toggleButtonIconNames: {
        type: Array,
        value: ['bookmark-border', 'bookmark'],
      },
    };
  }

  _onToggleButton() {
    this.element.bookmarked = !this.element.bookmarked;
  }

  _getToggleButtonValue() {
    return this.element ? (this.element.bookmarked ? true : false) : undefined;
  }

  _calculateHeaderColor(element) {
    var headerColor = "#cfcfcf";//this.headerColor;
    if (element) {
      if (element.color) {
        headerColor = element.color;
      } else if (element.type && element.type.color) {
        headerColor = element.type.color;
      }
    }
    return headerColor;
  }

  _elementChanged(element) {
    super._updateToggleButtonIcon();
  }
}

// Register custom element definition using standard platform API
customElements.define(CTreeElement.is, CTreeElement);
