import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { follow, unFollow } from "../redux/actions/profileAction";

const FollowBtn = ({ user }) => {
  const [followed, setFollowed] = useState(false);
  const dispatch = useDispatch();
  const { auth, profile } = useSelector((state) => state);

  const handleFollow = () => {
    setFollowed(true);
    dispatch(follow({ users: profile.users, user, auth }));
  };

  useEffect(() => {
    if (auth.user.following.find((item) => item._id === user._id)) {
      setFollowed(true);
    }
  }, [auth.user.following, user._id]);

  const handleUnFollow = () => {
    setFollowed(false);
    dispatch(unFollow({ users: profile.users, user, auth }));
  };

  return (
    <div>
      {followed ? (
        <button className="btn btn-outline-danger" onClick={handleUnFollow}>
          UnFollow
        </button>
      ) : (
        <button className="btn btn-outline-info" onClick={handleFollow}>
          Follow
        </button>
      )}
    </div>
  );
};

export default FollowBtn;
