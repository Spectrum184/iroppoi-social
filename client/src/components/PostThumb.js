import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const PostThumb = ({ posts, result }) => {
  const { theme } = useSelector((state) => state);

  if (result === 0) return <h2 className="text-center">No Post</h2>;

  return (
    <div className="post-thumb">
      {posts.map((post) => (
        <Link key={post._id} to={`/post/${post._id}`}>
          <div className="post-thumb-display">
            <img
              src={post.images[0].url}
              alt={post.images[0].url}
              style={{ filter: theme ? "invert(1)" : "invert(0)" }}
            />
            <div className="post-thumb-menu">
              <i className="far fa-heart">{post.likes.length}</i>
              <i className="far fa-comment">{post.comments.length}</i>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostThumb;