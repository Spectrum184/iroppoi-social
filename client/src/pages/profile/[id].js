import React, { useEffect, useState } from "react";
import Info from "../../components/profile/Info";
import Posts from "../../components/profile/Posts";
import Saved from "../../components/profile/Saved";
import { useSelector, useDispatch } from "react-redux";
import LoadIcon from "../../images/loading.gif";
import { getProfileUsers } from "../../redux/actions/profileAction";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { profile, auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [saveTab, setSaveTab] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    if (profile.ids.every((item) => item !== id)) {
      dispatch(getProfileUsers({ id, auth }));
    }
  }, [id, profile.ids, auth, dispatch]);

  return (
    <div className="profile">
      <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />
      {auth.user._id === id && (
        <div className="profile-tab">
          <button
            className={saveTab ? "" : "active"}
            onClick={() => setSaveTab(false)}
          >
            Post
          </button>
          <button
            className={saveTab ? "active" : ""}
            onClick={() => setSaveTab(true)}
          >
            Saved
          </button>
        </div>
      )}
      {profile.loading ? (
        <img className="d-block mx-auto my-4" src={LoadIcon} alt="loading" />
      ) : (
        <>
          {saveTab ? (
            <Saved auth={auth} profile={profile} dispatch={dispatch} id={id} />
          ) : (
            <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
