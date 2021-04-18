import React from "react";
import { Link } from "react-router-dom";

const CardFooter = ({ post }) => {
  return (
    <div className="card-footer">
      <div className="card-icon-menu">
        <div>
          <i className="far fa-heart" />
          <Link to={`/post/${post._id}`} className="text-dark">
            <i className="far fa-comment" />
          </Link>
          <i className="far fa-paper-plane" />
        </div>
        <i className="far fa-bookmark" />
      </div>
      <div className="d-flex justify-content-between mx-0">
        <h6 style={{ padding: "0 34px", cursor: "pointer" }}>
          {post.likes.length}
        </h6>
        <h6 style={{ padding: "0 25px", cursor: "pointer" }}>
          {post.comments.length} comments
        </h6>
      </div>
    </div>
  );
};

export default CardFooter;
