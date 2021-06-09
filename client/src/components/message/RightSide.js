import React, { useEffect, useState } from "react";
import UserCard from "../UserCard";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import MsgDisplay from "./MsgDisplay";

const RightSide = () => {
  const { auth, message } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const newUser = message.users.find((user) => user._id === id);
    if (newUser) {
      setUser(newUser);
    }
  }, [message.users, id]);

  return (
    <>
      <div className="message-header">
        <UserCard user={user}>
          <i className="fas fa-trash text-danger" />
        </UserCard>
      </div>
      <div className="chat-container">
        <div className="chat-display">
          <div className="chat-row other-message">
            <MsgDisplay user={user} />
          </div>
          <div className="chat-row your-message">
            <MsgDisplay user={auth.user} />
          </div>
        </div>
      </div>
      <form className="chat-input">
        <input
          type="text"
          placeholder="Enter your message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="material-icons"
          disabled={text ? false : true}
        >
          near_me
        </button>
      </form>
    </>
  );
};

export default RightSide;
