import React from "react";
import Avatar from "../Avatar";
import Times from "./Times";
import { imageShow, videoShow } from "../../utils/mediaShow";
import { useSelector, useDispatch } from "react-redux";
import { deleteMessages } from "../../redux/actions/messageAction";

const MsgDisplay = ({ user, msg, theme, data }) => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleDeleteMessage = () => {
    if (!data) return;

    if (window.confirm("Do you want to delete?"))
      dispatch(deleteMessages({ data, msg, auth }));
  };

  return (
    <>
      <div className="chat-title">
        <Avatar src={user.avatar} size="small-avatar" />
        <span>{user.username}</span>
        <div className="your-content">
          {user._id === auth.user._id && (
            <i
              className="fas fa-trash text-danger"
              onClick={handleDeleteMessage}
            />
          )}

          <div>
            {msg.text && (
              <div
                className="chat-text"
                style={{ filter: theme ? "invert(1)" : "invert(0)" }}
              >
                {msg.text}
              </div>
            )}
            {msg.media.map((item, index) => (
              <div key={index}>
                {item.url.match(/video/i)
                  ? videoShow(item.url, theme)
                  : imageShow(item.url, theme)}
              </div>
            ))}
          </div>
          {msg.call && (
            <button
              className="btn d-flex align-items-center py-3"
              style={{ background: "#eee", borderRadius: "10px" }}
            >
              <span
                className="material-icons font-weight-bold mr-1"
                style={{
                  fontSize: "2.5rem",
                  color: msg.call.times === 0 ? "crimson" : "green",
                  filter: theme ? "invert(1)" : "invert(0)",
                }}
              >
                {msg.call.times === 0
                  ? msg.call.video
                    ? "videocam_off"
                    : "phone_disable"
                  : msg.call.video
                  ? "video_camera_front"
                  : "call"}
              </span>
              <div className="text-left">
                <h6>{msg.call.video ? "Video Call" : "Audio Call"}</h6>
                <small>
                  {msg.call.times > 0 ? (
                    <Times total={msg.call.times} />
                  ) : (
                    new Date(msg.call.times).toLocaleDateString()
                  )}
                </small>
              </div>
            </button>
          )}
        </div>
        <div className="chat-time">
          {new Date(msg.createdAt).toLocaleString()}
        </div>
      </div>
    </>
  );
};

export default MsgDisplay;
