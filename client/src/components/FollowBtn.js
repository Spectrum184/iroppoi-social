import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { follow, unFollow } from "../redux/actions/profileAction";

const FollowBtn = ({ user }) => {
  const [followed, setFollowed] = useState(false);
  const dispatch = useDispatch();
  const { auth, profile } = useSelector((state) => state);
  const [load, setLoad] = useState(false);

  const handleFollow = async () => {
    if (load) return;

    setFollowed(true);

    setLoad(true);
    await dispatch(follow({ users: profile.users, user, auth }));
    setLoad(false);
  };

  useEffect(() => {
    if (auth.user.following.find((item) => item._id === user._id)) {
      setFollowed(true);
    }
  }, [auth.user.following, user._id]);

  const handleUnFollow = async () => {
    if (load) return;

    setFollowed(false);

    setLoad(true);
    await dispatch(unFollow({ users: profile.users, user, auth }));
    setLoad(false);
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
