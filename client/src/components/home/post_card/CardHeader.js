import React from "react";
import Avatar from "../../Avatar";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../../redux/actions/globalTypes";
import moment from "moment";

const CardHeader = ({ post }) => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleEditPost = () => {
    dispatch({ type: GLOBAL_TYPES.STATUS, payload: { ...post, onEdit: true } });
  };

  return (
    <div className="card-header">
      <div className="d-flex">
        <Avatar src={post.user.avatar} size="big-avatar" />
        <div className="card-name">
          <h6>
            <Link to={`/profile/${post.user._id}`} className="text-dark">
              {post.user.username}
            </Link>
          </h6>
          <small className="text-muted">
            {moment(post.createAt).fromNow()}
          </small>
        </div>
      </div>
      <div className="nav-item dropdown">
        <span className="material-icons" id="more-link" data-toggle="dropdown">
          more_horiz
        </span>
        <div className="dropdown-menu">
          {auth.user._id === post.user._id && (
            <div>
              <div className="dropdown-item" onClick={handleEditPost}>
                <span className="material-icons">create</span> Edit Post
              </div>
              <div className="dropdown-item">
                <span className="material-icons">delete_outline</span> Remove
                Post
              </div>
            </div>
          )}
          <div className="dropdown-item">
            <span className="material-icons">content_copy</span> Copy Link
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
