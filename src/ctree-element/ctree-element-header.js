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
/* TODO: just for testing avatars, remove once user avatars loaded */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-styles/shadow.js';
import '../ctree-dialogs/ctree-user-dialog-accessor.js';
import '../ctree-icons/ctree-icons.js';
import '@polymer/iron-meta/iron-meta.js';
import '../ctree-loader/lorem.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class CTreeElementHeader extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        white-space: nowrap;
        padding: 4px 8px;
      }
      .contributor {
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: url(../../images/no-avatar.png);
        background-size: 100% auto;
        background-repeat: no-repeat;
        background-position: center;
      }
      #designer {
        min-width: 48px;
        width: 48px;
        height: 48px;
        margin-top: 4px;
      }
      #contributors {
        display: inline-block;
        position: relative;
        left: -6px;
        height: 48px;
        padding: 4px 4px;
        vertical-align: top;
      }
      #contributors .contributor {
        @apply --shadow-elevation-3dp;
      }
      #related {
        display: inline-block;
        position: absolute;
        padding: 4px 0;
        right: 4px;
        font-weight: bold;
        font-size: large;
      }
      #children {
        vertical-align: text-bottom;
      }
      .type-count {
        display: inline-block;
        vertical-align: text-bottom;
      }
      .type-icon {
        padding-left: 2px;
        padding-right: 4px;
      }
    </style>

    <ctree-user-dialog-accessor id="userDialog"></ctree-user-dialog-accessor>

    <paper-button class="contributor" id="designer" title="designer" on-tap="designerClicked" raised=""></paper-button>
    <div id="contributors" on-tap="contributorsClicked"><paper-ripple></paper-ripple>
      <div class="contributor" title="contributor"></div>
      <div class="contributor" title="contributor"></div>
      <div class="contributor" title="contributor"></div>
    </div>
    <div id="related" on-tap="relatedClicked"><paper-ripple></paper-ripple>
      <div id="children">
        <iron-icon icon="relation-from"></iron-icon>
        <div class="type-count">3</div><iron-icon class="type-icon" src="[[testTypeIcon]]"></iron-icon>
        <div class="type-count">1</div><iron-icon class="type-icon" src="[[testTypeIcon]]"></iron-icon>
      </div>
      <div id="parents">
        <iron-icon icon="relation-to"></iron-icon>
        <div class="type-count">2</div><iron-icon class="type-icon" src="[[testTypeIcon]]"></iron-icon>
      </div>
    </div>
`;
  }

  static get is() { return 'ctree-element-header'; }

  /**
   * Fired when a the contributors are tapped.
   *
   * @event contributors-tapped
   */

  /**
   * Fired when a the related elements are tapped.
   *
   * @event related-tapped
   */

  static get properties() {
    return {
      noclick: {
        type: Boolean,
        reflectToAttribute: true,
        value: false,
        observer: '_updateClickable',
      },

      norelations: {
        type: Boolean,
        reflectToAttribute: true,
        value: false,
        observer: '_updateRelationsVisible',
      },

      // TODO: remove test icon
      testTypeIcon: String,
    };
  }

  ready() {
    super.ready();

    // TODO: remove test images
    var imagePath = document.createElement('iron-meta').byKey('rootPath') + "/images/";
    this.$.designer.style.backgroundImage = "url('" + imagePath + Lorem.avatarUrl() + "')";
    var contributors = this.$.contributors.children;
    for (var i = 0; i < contributors.length; i++) {
      var contributor = contributors[i];
      if (contributor.tagName == 'DIV') {
        contributor.style.backgroundImage = "url('" + imagePath + Lorem.avatarUrl() + "')";
      }
    }
    this.testTypeIcon = imagePath + "app-icon-32.png";
  }

  designerClicked() {
    if (this.noclick) return;

    // TODO: populate with designer data
    this.$.userDialog.open();
  }

  contributorsClicked() {
    if (this.noclick) return;

    this.dispatchEvent(new CustomEvent('contributors-tapped', {bubbles: true, composed: true}));
  }

  relatedClicked() {
    if (this.noclick) return;

    this.dispatchEvent(new CustomEvent('related-tapped', {bubbles: true, composed: true}));
  }

  _updateClickable(noClick) {
    this.$.designer.raised = !noClick;
    this.$.designer.noink = noClick;
    this.$.designer.style.cursor = noClick ? "default" : "pointer";
    if (noClick) {
      // HACK: force shadow when noclick set since we're removing raised
      this.$.designer.style.boxShadow = "0 3px 4px 0 rgba(0, 0, 0, 0.14),"
                                      + "0 1px 8px 0 rgba(0, 0, 0, 0.12),"
                                      + "0 3px 3px -2px rgba(0, 0, 0, 0.4)";
    }
    this.$.contributors.firstChild.noink = noClick;
    this.$.contributors.style.cursor = noClick ? "default" : "pointer";
    this.$.related.firstChild.noink = noClick;
    this.$.related.style.cursor = noClick ? "default" : "pointer";
  }

  _updateRelationsVisible(noRelations) {
    this.$.related.style.display = noRelations ? "none" : "inline-block";
  }
}

// Register custom element definition using standard platform API
customElements.define(CTreeElementHeader.is, CTreeElementHeader);
