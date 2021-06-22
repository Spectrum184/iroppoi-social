import React, { useState, useEffect, useRef } from "react";
import UserCard from "../UserCard";
import { useSelector, useDispatch } from "react-redux";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import { getDataAPI } from "../../utils/fetchData";
import { useHistory, useParams } from "react-router-dom";
import { MESS_TYPES, getConversation } from "../../redux/actions/messageAction";

const LeftSide = () => {
  const [search, setSearch] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const { auth, message } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const pageEnd = useRef();
  const [page, setPage] = useState(0);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return setSearchUser([]);

    try {
      const res = await getDataAPI(`search?username=${search}`, auth.token);

      setSearchUser(res.data.users);
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

  const handleAddUser = (user) => {
    setSearch("");
    setSearchUser([]);
    dispatch({
      type: MESS_TYPES.ADD_USER,
      payload: { ...user, text: "", media: [] },
    });

    return history.push(`/message/${user._id}`);
  };

  const isActive = (user) => {
    if (id === user._id) return "active";

    return "";
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].intersecting) {
          setPage((p) => p + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );
    observer.observe(pageEnd.current);
  }, [setPage]);

  useEffect(() => {
    if (message.resultUsers >= (page - 1) * 9 && page > 1) {
      dispatch(getConversation({ auth, page }));
    }
  }, [auth, dispatch, page, message.resultUsers]);

  useEffect(() => {
    if (message.firstLoad) return;
    dispatch(getConversation({ auth }));
  }, [message.firstLoad, dispatch, auth]);

  return (
    <>
      <form className="message-header" onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          placeholder="Enter to search!"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" style={{ display: "none" }}>
          Search
        </button>
      </form>

      <div className="message-chat-list">
        {searchUser.length !== 0 ? (
          <>
            {searchUser.map((user) => (
              <div
                key={user._id}
                className={`message-user ${isActive(user)}`}
                onClick={() => handleAddUser(user)}
              >
                <UserCard user={user} />
              </div>
            ))}
          </>
        ) : (
          <>
            {message.users.map((user) => (
              <div
                key={user._id}
                className={`message-user ${isActive(user)}`}
                onClick={() => handleAddUser(user)}
              >
                <UserCard user={user} msg={true}>
                  <i className="fas fa-circle" />
                </UserCard>
              </div>
            ))}
          </>
        )}
        <button ref={pageEnd} style={{ opacity: 0 }}>
          Load more
        </button>
      </div>
    </>
  );
};

export default LeftSide;
