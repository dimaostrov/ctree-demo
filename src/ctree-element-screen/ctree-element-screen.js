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

import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '../ctree-element/ctree-element.js';
import '../ctree-feedback-bar/ctree-feedback-bar.js';
import '../ctree-icons/ctree-icons.js';
import '../ctree-loader/ctree-element-loader-test.js';
import '../ctree-import/ctree-import.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class CTreeElementScreen extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
      }
      ctree-element {
        width: 100%;
        height: 100%;
      }
      iron-pages {
        position: absolute;
        top: 48px;
        bottom: 40px;
        left: 0;
        right: 0;
        overflow: hidden;
      }
      iron-pages * {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
      #nav {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 40px;
        border: 0;
        border-spacing: 0;
      }
      #nav td {
        valign: middle;
        padding: 0;
      }
      #feedback {
        width: 100%;
        white-space: nowrap;
      }
      ctree-feedback-bar {
        text-align: center;
      }
      paper-icon-button[hidden] {
        display: none !important;
      }
    </style>

    <ctree-import id="importPage" href="/src/ctree-element-screen/ctree-[[page]]-page.html" loading="{{_importingPage}}"></ctree-import>
    <ctree-element-loader-test ctree-key="[[ctreeKey]]" element="{{element}}" element-id="[[elementId]]" item-comment="{{comment}}" item-comment-icon="{{commentIcon}}"></ctree-element-loader-test>

    <ctree-element id="element" element="[[element]]" noclose="[[noclose]]" on-close-tapped="_closeClicked">
      <iron-pages id="pages" selected="[[page]]" attr-for-selected="name">
        <ctree-details-page name="details" element="{{element}}" description-config="[[descriptionConfig]]" description-segments="[[descriptionSegments]]" on-contributors-tapped="_onContributorsTapped" on-related-tapped="_onRelatedTapped" on-feedback-tapped="_onFeedbackTapped"></ctree-details-page>
        <ctree-contributors-page name="contributors" description-config="[[descriptionConfig]]" on-history-tapped="_onHistoryTapped"></ctree-contributors-page>
        <ctree-history-page name="history" description-config="[[descriptionConfig]]" contributor="[[historyContributor]]"></ctree-history-page>
        <ctree-related-page name="related"></ctree-related-page>
        <ctree-feedback-page name="feedback" description-config="[[descriptionConfig]]" segment="[[feedbackSegment]]"></ctree-feedback-page>
      </iron-pages>
      <table id="nav" hidden\$="[[!_descriptionVersionBarVisible]]"><tbody><tr>
        <td><paper-icon-button id="previous" icon="navigate-before" title="previous element variation" hidden\$=""></paper-icon-button></td>
        <td id="feedback" colspan="2"><ctree-feedback-bar on-feedback-tapped="_onFeedbackTapped"></ctree-feedback-bar></td>
        <td><paper-icon-button id="next" icon="navigate-next" title="next element variation" hidden\$=""></paper-icon-button></td>
      </tr></tbody></table>
    </ctree-element>
`;
  }

  static get is() { return 'ctree-element-screen'; }

  /**
   * Fired when the close button is tapped.
   *
   * @event close-tapped
   */

  static get properties() {
    return {
      /**
       * The unique key identifying a cTree.  If the site only has one cTree
       * this doesn't need to be set.
       */
      ctreeKey: String,

      /**
       * If true, don't show close button.
       */
      noclose: Boolean,

      element: {
        type: Object,
        observer: '_elementChanged',
      },

      elementId: {
        type: Number,
        notify: true,
      },

      descriptionConfig: {
        type: Number,
        observer: '_descriptionConfigChanged',
        notify: true,
      },

      descriptionSegments: {
        type: Array,
        observer: '_descriptionSegmentsChanged',
        notify: true,
      },

      page: {
        type: String,
        observer: '_pageChanged',
        notify: true,
      },

      feedbackSegment: Number,

      historyContributor: Number,

      _descriptionVersionBarVisible: {
        type: Boolean,
        observer: '_descriptionVersionBarVisibleChanged',
        value: true,
      },
    };
  }

  _closeClicked() {
    this.dispatchEvent(new CustomEvent('close-tapped', {bubbles: true, composed: true}));
  }

  _pageChanged(page) {
    if (!page) {
      this.page = 'details';
    }

    if (page == 'details' || page == 'feedback') {
      // applies to specific description segment so set default description config
      this._ensureDescriptionConfigSet();
    } else if (page == 'related') {
      // applies to entire element so enter general state instead of specific description config state
      this.descriptionConfig = null;
    }
    this.$.importPage.load();
  }

  _elementChanged(element) {
    if (element) {
      this.elementId = element.id;
    }
    if (!this.descriptionConfig && element) {
      this._pageChanged(this.page);
    }
    // TODO:
  }

  _descriptionConfigChanged(descriptionConfig) {
    this._descriptionVersionBarVisible = (descriptionConfig ? true : false);
    if (!descriptionConfig && this.element) {
      this._pageChanged(this.page);
    }
    // TODO:
  }

  _descriptionSegmentsChanged(descriptionSegments) {
    // TODO:
  }

  _descriptionVersionBarVisibleChanged(visible) {
    // HACK: for some reson this.$ is undefined when open link with dialog parameters
    if (!this.$) return;

    if (visible) {
      this.$.pages.style.bottom = '40px';
    } else {
      this.$.pages.style.bottom = '0';
    }
  }

  _ensureDescriptionConfigSet() {
    if (!this.descriptionConfig) {
      // TODO: get first config ID from element data
      this.descriptionConfig = 1;
    }
  }

  _onFeedbackTapped(e) {
    // TODO: figure out segment data from e or e.detail & pass as segmentData
    this.feedbackSegment = null;
    this.page = 'feedback';
  }

  _onContributorsTapped() {
    this.page = 'contributors';
  }

  _onRelatedTapped() {
    this.page = 'related';
  }

  _onHistoryTapped(e) {
    var detail = e.detail
    this.historyContributor = detail.contributor;
    if (detail.generalHistory) {
      // history shown should be for the entire element, not a specific description config
      this.descriptionConfig = null;
    }
    this.page = 'history';
  }
}

// Register custom element definition using standard platform API
customElements.define(CTreeElementScreen.is, CTreeElementScreen);
