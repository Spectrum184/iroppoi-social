import React from "react";
import Avatar from "../Avatar";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";

const Status = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <div className="status my-3 d-flex">
      <Avatar src={auth.user.avatar} size="big-avatar" />
      <button
        className="btn-status flex-fill"
        onClick={() => dispatch({ type: GLOBAL_TYPES.STATUS, payload: true })}
      >
        {auth.user.username}, what do you mind?
      </button>
    </div>
  );
};

export default Status;
