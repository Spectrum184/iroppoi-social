import React from "react";
import { useSelector } from "react-redux";

const LikeButton = ({ liked, handleLike, handleUnLike }) => {
  const { theme } = useSelector((state) => state);

  return (
    <>
      {liked ? (
        <i
          className="fas fa-heart text-danger"
          onClick={handleUnLike}
          style={{ filter: theme ? "invert(1)" : "invert(0)" }}
        />
      ) : (
        <i className="far fa-heart" onClick={handleLike} />
      )}
    </>
  );
};

export default LikeButton;
