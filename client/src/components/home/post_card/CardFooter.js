import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LikeButton from "../../LikeButton";
import { useSelector, useDispatch } from "react-redux";
import { likePost, unLikePost } from "../../../redux/actions/postAction";

const CardFooter = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleLike = async () => {
    if (loadLike) return;
    setLiked(true);
    setLoadLike(true);
    await dispatch(likePost({ post, auth }));
    setLoadLike(false);
  };

  const handleUnLike = async () => {
    if (loadLike) return;
    setLiked(false);
    setLoadLike(true);
    await dispatch(unLikePost({ post, auth }));
    setLoadLike(false);
  };

  useEffect(() => {
    if (post.likes.find((like) => like._id === auth.user._id)) {
      setLiked(true);
    }
  }, [post.likes, auth.user._id]);

  return (
    <div className="card-footer">
      <div className="card-icon-menu">
        <div>
          <LikeButton
            isLike={liked}
            handleLike={handleLike}
            handleUnLike={handleUnLike}
          />
          <Link to={`/post/${post._id}`} className="text-dark">
            <i className="far fa-comment" />
          </Link>
          <i className="far fa-paper-plane" />
        </div>
        <i className="far fa-bookmark" />
      </div>
      <div className="d-flex justify-content-between mx-0">
        <h6 style={{ padding: "0 34px", cursor: "pointer" }}>
          {post.likes.length} likes
        </h6>
        <h6 style={{ padding: "0 25px", cursor: "pointer" }}>
          {post.comments.length} comments
        </h6>
      </div>
    </div>
  );
};

export default CardFooter;
