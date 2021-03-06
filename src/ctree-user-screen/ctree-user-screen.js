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
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-toolbar/paper-toolbar.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '../ctree-icons/ctree-icons.js';
import '../ctree-loader/ctree-user-loader-test.js';
import '../ctree-toolbar-behavior/ctree-toolbar-behavior.js';
import '../ctree-toolbar-behavior/ctree-toolbar-shared-styles.js';
import '../ctree-import/ctree-import.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class CTreeUserScreen extends CTree.ToolbarBehavior {
  static get template() {
    return html`
    <style include="ctree-toolbar-shared-styles"></style>
    <style>
      :host {
        display: block;
      }
      #container {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
      .toolbar {
        background: url(https://static.pexels.com/photos/33109/fall-autumn-red-season.jpg);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        text-shadow: 2px 2px 2px black;
      }
      #avatar {
        display: block;
        min-width: 36px;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: url(../../images/no-avatar.png);
        background-size: 100% auto;
        background-repeat: no-repeat;
        background-position: center;
      }
      paper-tab {
        width: 0;
      }
      paper-tab iron-icon {
        padding-right: 2px;
      }
      .tabTooltip {
        visibility: hidden;
      }
      iron-pages {
        height: calc(100% - var(--paper-toolbar-height) * 2);
        width: 100%;
        background-color: white;
        position: absolute;
        top: calc(var(--paper-toolbar-height) * 2);
        bottom: 0;
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
      @media (max-width: 340px) {
        .tabLabel {
          display: none;
        }
        .tabTooltip {
          visibility: visible;
        }
      }
    </style>

    <ctree-import id="importPage" href="/src/ctree-user-screen/ctree-[[page]]-page.html" loading="{{_importingPage}}"></ctree-import>
    <ctree-user-loader-test ctree-key="[[ctreeKey]]">

    <div id="container">
      <paper-toolbar class="toolbar medium-tall">
        <div slot="top" id="avatar"></div>
        <span slot="top" class="title">Title</span>
        <!-- TODO: see if some of the button attributes can be set by the behavior -->
        <paper-icon-button slot="top" id="favorite" icon="[[_toggleButtonIcon]]" alt="favorite" on-tap="_toggleButton"></paper-icon-button>
        <paper-icon-button slot="top" id="share" icon="share" alt="share" on-tap="_showShare"></paper-icon-button>
        <paper-icon-button slot="top" id="close" icon="close" alt="close" on-tap="_closeClicked" hidden\$="[[noclose]]"></paper-icon-button>
        <paper-tooltip slot="top" for="favorite" offset="-8">Favorite</paper-tooltip>
        <paper-tooltip slot="top" for="share" offset="-8">Share</paper-tooltip>
        <paper-tooltip slot="top" for="close" offset="-8">Close</paper-tooltip>

        <paper-tabs slot="bottom" class="fit" selected="{{page}}" attr-for-selected="name">
          <paper-tab id="detailsTab" name="details" link="">
            <iron-icon icon="account-circle"></iron-icon><div class="tabLabel">DETAILS</div>
          </paper-tab>
          <paper-tab id="statsTab" name="stats" link="">
            <iron-icon icon="account-stats"></iron-icon><div class="tabLabel">STATS</div>
          </paper-tab>
          <paper-tab id="historyTab" name="history" link="">
            <iron-icon icon="history"></iron-icon><div class="tabLabel">HISTORY</div>
          </paper-tab>
        </paper-tabs>
        <paper-tooltip class="tabTooltip" for="detailsTab" offset="-8">Details</paper-tooltip>
        <paper-tooltip class="tabTooltip" for="statsTab" offset="-8">Stats</paper-tooltip>
        <paper-tooltip class="tabTooltip" for="historyTab" offset="-8">History</paper-tooltip>
      </paper-toolbar>
    </div>
    <iron-pages id="pages" selected="[[page]]" attr-for-selected="name">
      <!--<ctree-details-page name="details"></ctree-details-page>
      <ctree-stats-page name="stats"></ctree-stats-page>
      <ctree-history-page name="history"></ctree-history-page>-->
    </iron-pages>
  </ctree-user-loader-test>
`;
  }

  static get is() { return 'ctree-user-screen'; }

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

      user: {
        type: Object,
        observer: '_userChanged',
      },

      userId: {
        type: Number,
        notify: true,
      },

      page: {
        type: String,
        notify: true,
        observer: '_pageChanged',
      },

      /**
       * Toggle icon names.
       */
      _toggleButtonIconNames: {
        type: Array,
        value: ['favorite-border', 'favorite'],
      },
    };
  }

  ready() {
    super.ready();

    // TODO: just to test
    this.user = {
      id: 1,
      name: 'New User',
      favorited: false,
    };
  }

  _onToggleButton() {
    this.user.favorited = !this.user.favorited;
  }

  _getToggleButtonValue() {
    return this.user ? this.user.favorited : undefined;
  }

  _userChanged(user) {
    super._updateToggleButtonIcon();
    if (user) {
      this.userId = user.id;
    }
  }

  _pageChanged(page) {
    if (!page) {
      this.page = 'details';
    }

    this.$.importPage.load();
  }
}

// Register custom element definition using standard platform API
customElements.define(CTreeUserScreen.is, CTreeUserScreen);
