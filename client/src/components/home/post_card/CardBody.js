import React, { useState } from "react";
import Carousel from "../../Carousel";

const CardBody = ({ post, theme }) => {
  const [readMore, setReadMore] = useState(false);

  return (
    <div className="card-body">
      <div
        className="card-body-content"
        style={{
          filter: theme ? "invert(1)" : "invert(0)",
          color: theme ? "white" : "#111",
        }}
      >
        <span>
          {post.content.length < 60
            ? post.content
            : readMore
            ? post.content + " "
            : post.content.slice(0, 60) + "..."}
        </span>
        {post.content.length > 60 && (
          <span className="read-more" onClick={() => setReadMore(!readMore)}>
            {readMore ? "Hide" : "Read more"}
          </span>
        )}
      </div>
      {post.images.length > 0 && (
        <Carousel images={post.images} id={post._id} />
      )}
    </div>
  );
};

export default CardBody;
