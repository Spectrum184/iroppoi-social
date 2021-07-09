import React from "react";
import { useDispatch, useSelector } from "react-redux";

import UserCard from "../UserCard";
import FollowBtn from "../FollowBtn";
import LoadIcon from "../../images/loading.gif";

import { getSuggestions } from "../../redux/actions/suggestionsAction";

const RightSideBar = () => {
  const { auth, suggestions } = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <div className="mt-3">
      <UserCard user={auth.user} />
      <div className="d-flex justify-content-between align-item-center my-2">
        <h5 className="text-danger">Suggestions for you</h5>
        {!suggestions.loading && (
          <i
            className="fas fa-redo"
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(getSuggestions(auth.token))}
          />
        )}
      </div>

      {suggestions.loading ? (
        <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4" />
      ) : (
        <div className="suggestions">
          {suggestions.users.map((user) => (
            <UserCard user={user} key={user._id}>
              <FollowBtn user={user} />
            </UserCard>
          ))}
        </div>
      )}
      <div style={{ opacity: 0.5 }} className="my-2 text-center">
        <a
          href="https://github.com/Spectrum184/"
          target="_blank"
          rel="noreferrer"
          style={{ wordBreak: "break-all" }}
        >
          <small>Welcome to my github!</small>
        </a>
      </div>
    </div>
  );
};

export default RightSideBar;
