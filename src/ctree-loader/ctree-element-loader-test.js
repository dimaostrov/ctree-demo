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

import '@polymer/iron-meta/iron-meta.js';
import './ctree-loader-behavior-test.js';
import './lorem.js';

// test configuration values
var Test = {
  LOAD_DELAY: 2500,
};

class CTreeElementLoader extends CTree.LoaderBehavior {

  static get is() { return 'ctree-element-loader-test'; }

  static get properties() {
    return {
      /**
       * List item to load data for.
       *
       * Structure:
       *   {
       *     element: Element,
       *     feedback: Feedback,
       *     descriptionConfig: Number,
       *     descriptionSegments: [Number],
       *     commentCode: Number,
       *     commentData: Object,	// type depends on commentCode
       *   }
       */
      listItem: {
        type: Object,
        observer: '_listItemChanged',
      },

      maxCommentLength: {
        type: Number,
        value: 100,
      },

      /**
       * Comment generated from list item data.  Some additonal content may need
       * to be loaded before the comment can be generated.
       */
      itemComment: {
        type: String,
        notify: true,
      },

      /**
       * Name of icon or URL of image to accompany item comment.
       */
      itemCommentIcon: {
        type: String,
        notify: true,
      },

      /**
       * Element to load data for.  Events will be fired for this element as
       * data is loaded into it.
       *
       * Structure:
       *   {
       *     id: Number,
       *     type: ElementType,
       *     title: String,
       *     parents: [Numbers],
       *     children: [Numbers],
       *     childrenSearchComplete: Boolean,
       *     designer: String,		// TODO: should probably be an object (user ID or reference to public user object)
       *     description: [{
       *       id: Number,
       *       contributors: [String],  // TODO: should probably be an object (user ID or reference to public user object)
       *       segments: [{
       *         id: Number,
       *         type: SegmentType,
       *         variations: [{
       *           id: Number,
       *           data: dynamic,	// data type depends on segment type
       *         }, ...],
       *       }, ...],
       *     }, ...],
       *     feedback: [{
       *       reviewer: String,	// TODO: should probably be an object (user ID or reference to public user object)
       *       text: String,
       *     }, ...],
       *     bookmarked: Boolean,
       *   }
       */
      element: {
        type: Object,
        notify: true,
        observer: '_elementChanged',
      },

      elementId: {
        type: Number,
        observer: '_elementIdChanged',
      },
    };
  }

  _listItemChanged(listItem) {
    if (!listItem) return;

    this.element = listItem.element;
    this.itemComment = undefined;
    this.itemCommentIcon = undefined;
    this._updateComment();
  }

  _elementChanged(element) {
    if (!element) return;

    if (this.listItem && this.listItem.element !== element) {
      this.listItem = undefined;
    }
    this.elementId = element.id;
  }

  _elementIdChanged(elementId) {
    if (!elementId || (this.element && elementId == this.element.id) || !this._cTreeData) return;

    var cTreeData = this._cTreeData;
    this.element = cTreeData.elements[elementId];

    if (!this.element) {
      setTimeout(() => {
        if (this.element || this.elementId != elementId) return; // element or elementId updated

        // TODO: this should simulate reality better by only returning the pieces of the element needed for suggestedItem (id, type, name, description config, description segments)
        var element = cTreeData.testElements[elementId];
        cTreeData.elements[elementId] = element;

        if (this._cTreeData == cTreeData) {
          this.element = element;
        }
      }, Test.LOAD_DELAY);
    }
  }

  _updateComment() {
    var item = this.listItem;
    if (!item.commentCode) return;

    var SUBJECT = CTree.Loader.COMMENT_SUBJECT;
    var CATEGORY = CTree.Loader.COMMENT_CATEGORY;
    var subjectCode = item.commentCode % 100;
    var categoryCode = item.commentCode - subjectCode;
    var subjectData;
    if (categoryCode <= CATEGORY.NEEDS_FEEDBACK_FOR) {
      // use subject name
      switch (subjectCode) {
        case SUBJECT.ELEMENT:     subjectData = 'element';      break;
        case SUBJECT.TYPE:        subjectData = 'type';         break;
        case SUBJECT.TITLE:       subjectData = 'title';        break;
        case SUBJECT.DESCRIPTION: subjectData = 'description';  break;
        case SUBJECT.TRANSLATION: subjectData = 'translation';  break;
        case SUBJECT.FEEDBACK:    subjectData = 'feedback';     break;
        case SUBJECT.CATEGORY:    subjectData = 'category';     break;
        case SUBJECT.GROUP:       subjectData = 'group';        break;
        case SUBJECT.USER:        subjectData = 'designer';     break;  // TODO: do we need more subjects for different types of users?  this assumes it referss to the designer when we don't get the user name from the comment data (ex. updated)
        case SUBJECT.PARENT:      subjectData = 'parent';       break;
        case SUBJECT.CHILD:       subjectData = 'child';        break;
        case SUBJECT.SIBLING:     subjectData = 'sibling';      break;
      }
      if (categoryCode <= CATEGORY.TRANSLATED && typeof item.commentData === 'number') {
        // add time delta string
        var date = new Date();
        var timeSince = (date.getTime() - item.commentData) / 1000;
        if (timeSince > 0) {
          var timeValue;
          var timeUnit;
          if (timeSince < 60) {
            timeValue = timeSince;
            timeUnit = 'second';
          } else if (timeSince < 3600) {
            timeValue = Math.floor(timeSince / 60);
            timeUnit = 'minute';
          } else if (timeSince < 86400) {
            timeValue = Math.floor(timeSince / 3600);
            timeUnit = 'hour';
          } else if (timeSince < 604800) {
            timeValue = Math.floor(timeSince / 86400);
            timeUnit = 'day';
          } else if (timeSince < 4838400) {
            timeValue = Math.floor(timeSince / 604800);
            timeUnit = 'week';
          }
          if (timeValue) {
            subjectData += ' ' + timeValue + ' ' + timeUnit + (timeValue === 1 ? ' ago' : 's ago');
          } else {
            date.setTime(item.commentData);
            subjectData += ' ' + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
          }
        }
      }
    } else {
      // look up subject value
      if (typeof item.commentData === 'number') {
        var popular = (categoryCode == CATEGORY.POPULAR_FROM || categoryCode == CATEGORY.POPULAR_WITH);
        switch (subjectCode) {
          case SUBJECT.ELEMENT:
          case SUBJECT.PARENT:
          case SUBJECT.CHILD:
          case SUBJECT.SIBLING:
            var element = this._cTreeData.elements[item.commentData];
            if (element) {
              subjectData = element.title;
            } else {
              // TODO: load element at ID in item.commentData
              subjectData = 'element';
            }
            break;
          case SUBJECT.TYPE:
            var type = this._cTreeData.type[item.commentData];
            if (type) {
              subjectData = type.name;
            } else {
              subjectData = 'type';
            }
            break;
          case SUBJECT.TITLE:
            if (popular) {
              subjectData = 'title';
            } else {
              // TODO: get title segment with ID in item.commentData
              this.element.title;
            }
            break;
          case SUBJECT.DESCRIPTION:
            if (popular) {
              subjectData = 'description';
            } else {
              var description = Polymer.CTreeLoader.getFromArrayWithId(this.element.description, item.commentData, false);
              if (description && description.segments.length > 0) {
                var segments = description.segments;
                subjectData = '';
                for (var i = 0; i < segments.length; i++) {
                  var segment = segments[i];
                  var variations = segment.variations;
                  if (!variations || variations.length == 0 || !variations[0]) {
                    // TODO: load description
                    break;
                  }
                  if (!CTreeSegments || !CTreeSegments[segment.type]) {
                    // TODO: load segment type
                    break;
                  }
                  var type = CTreeSegments[segment.type];
                  if (type && type.getText) {
                    subjectData += type.getText(variations[0]);
                    if (subjectData.length >= this.maxCommentLength) {
                      subjectData = subjectData.substring(0, this.maxCommentLength);
                      break;
                    }
                  }
                }
              } else {
                // TODO: load description
                subjectData = 'description';
              }
            }
            break;
          case SUBJECT.TRANSLATION:
            if (popular) {
              subjectData = 'translation';
            } else {
              // TODO: get description translation with ID
              subjectData = 'translation';
            }
            break;
          case SUBJECT.FEEDBACK:
            if (popular) {
              subjectData = 'feedback';
            } else {
              var feedback = Polymer.CTreeLoader.getFromArrayWithId(this.element.feedback, item.commentData, false);
              if (feedback) {
                var feedback = allFeedback[item.commentData];
                // TODO: if no text we should try to get text from content (using segment type's getText)
                subjectData = feedback.text;
              } else {
                // TODO: Load feedback with ID item.commentData
              }
            }
            break;
          case SUBJECT.CATEGORY:
            // TODO: get category from ID in item.commentData
            subjectData = 'category';
            break;
          case SUBJECT.GROUP:
            // TODO: get group from ID in item.commentData
            subjectData = 'group';
            break;
          case SUBJECT.USER:
            // TODO: get user from ID in item.commentData
            subjectData = 'user';
            break;
        }
        if (subjectData) {
          item.commentData = subjectData;
        }
      }
    }
    if (!subjectData) {
      // TODO: could wait until subject data is loaded (i.e. don't update comment yet)
      subjectData = '';
    }
    switch (categoryCode) {
      case CATEGORY.NEW: this.itemComment = 'Added new ' + subjectData; break;
      case CATEGORY.UPDATED: this.itemComment = 'Updated ' + subjectData; break;
      case CATEGORY.TRANSLATED: this.itemComment = 'Translated ' + subjectData; break;
      case CATEGORY.NEEDS: this.itemComment = 'Needs ' + subjectData; break;
      case CATEGORY.NEEDS_FEEDBACK_FOR: this.itemComment = 'Needs feedback for ' + subjectData; break;
      case CATEGORY.POPULAR_FROM:
      case CATEGORY.POPULAR_WITH:
        var text = 'Popular ';
        if (subjectCode >= SUBJECT.CATEGORY) {
          switch (subjectCode) {
            case SUBJECT.PARENT:  text += 'child of ';    break;
            case SUBJECT.CHILD:   text += 'parent of ';   break;
            case SUBJECT.SIBLING: text += 'sibling of ';  break;
            default: text += (categoryCode == CATEGORY.POPULAR_FROM ? 'from ' : 'with '); break;
          }
        }
        this.itemComment = text + subjectData;
        this.itemCommentIcon = 'popular';
        break;
      case CATEGORY.SIMILAR_TO: this.itemComment = 'Similar to ' + subjectData; break;
      case CATEGORY.OPPOSING: this.itemComment = 'Opposing ' + subjectData; break;
    }
  }

  _urlChanged(url) {
    // do nothing for test loader
  }

  _cTreeDataChanged(cTreeData) {
    this.cTreeData = cTreeData;
    // TODO: set/clear data as needed
  }

  _userChanged(user) {
    // do nothing for test loader
  }
}
export { CTreeElementLoader };

// Register custom element definition using standard platform API
customElements.define(CTreeElementLoader.is, CTreeElementLoader);
