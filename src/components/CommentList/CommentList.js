import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage,
         FormattedDate,
         FormattedTime } from 'react-intl'
import { Link } from 'react-router-dom'
import parse from 'date-fns/parse'
import _map from 'lodash/map'
import _isObject from 'lodash/isObject'
import _sortBy from 'lodash/sortBy'
import _reverse from 'lodash/reverse'
import _each from 'lodash/each'
import MarkdownContent from '../MarkdownContent/MarkdownContent'
import messages from './Messages'
import './CommentList.css'

/**
 * CommentList renders the given comments as a list with some basic formatting,
 * starting with the most recent comment.
 *
 * @author [Neil Rotstan](https://github.com/nrotstan)
 */
export default class CommentList extends Component {
  render() {
    if (this.props.comments.length === 0) {
      return <div className="comment-list none">No Comments</div>
    }

    const commentDates = new Map()
    _each(this.props.comments,
          comment => commentDates.set(comment.id, parse(comment.created)))

    // Show in descending order, with the most recent comment first.
    const sortedComments =
      _reverse(_sortBy(this.props.comments,
                       comment => commentDates.get(comment.id).getTime()))

    const commentItems = _map(sortedComments, comment =>
      !_isObject(comment) ? null : (
        <li key={comment.id} className="comment-list__comment">
          <div className="comment-list__comment__header">
            <div className="comment-list__comment__author">
              {comment.osm_username}
            </div>
            <div className="comment-list__comment__published-at">
              <span className="time-part">
                <FormattedTime value={commentDates.get(comment.id)}
                               hour='2-digit'
                               minute='2-digit' />,
              </span>

              <span className="date-part">
                <FormattedDate value={commentDates.get(comment.id)}
                               year='numeric'
                               month='long'
                               day='2-digit' />
              </span>
            </div>
          </div>

          <div className="with-triangle-border">
            <MarkdownContent className="comment-list__comment__content"
                             markdown={comment.comment} />
          </div>

          <div className="comment-list__comment__meta">
            <div className="comment-list__comment__challenge-name">
              {this.props.includeChallengeNames && comment.challengeName}
            </div>

            {this.props.includeTaskLinks &&
             <div className="comment-list__comment__task-link">
               <Link to={`/challenge/${comment.challengeId}/task/${comment.taskId}`}>
                 <FormattedMessage {...messages.viewTaskLabel} />
               </Link>
             </div>
            }
          </div>
        </li>
      )
    )

    return (
      <ul className={classNames('comment-list', this.props.className)}>
        {commentItems}
      </ul>
    )
  }
}

CommentList.propTypes = {
  /** The comments to display */
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      osm_username: PropTypes.string,
      comment: PropTypes.string,
      created: PropTypes.string,
    })
  ),
  /**
   * Set to true to include a link to the task on which the comment appears
   */
  includeTaskLinks: PropTypes.bool,
}

CommentList.defaultProps = {
  comments: [],
  includeTaskLinks: false,
}
