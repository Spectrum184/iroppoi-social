import React from "react";
import Avatar from "../Avatar";

const MsgDisplay = ({ user }) => {
  return (
    <>
      <div className="chat-title">
        <Avatar src={user.avatar} size="small-avatar" />
        <span>{user.username}</span>
        <div className="chat-text">Aavavavav</div>
        <div className="chat-time">May 2021</div>
      </div>
    </>
  );
};

export default MsgDisplay;
