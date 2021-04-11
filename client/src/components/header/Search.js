import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDataAPI } from "../../utils/fetchData";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import LoadIcon from "../../images/loading.gif";

import UserCard from "../UserCard";

const Search = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [load, setLoad] = useState(false);

  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (search) {
  //     getDataAPI(`search?username=${search}`, auth.token)
  //       .then((res) => setUsers(res.data.users))
  //       .catch((err) => {
  //         dispatch({
  //           type: GLOBAL_TYPES.ALERT,
  //           payload: { error: err.response.data.msg },
  //         });
  //       });
  //   } else {
  //     setUsers([]);
  //   }
  // }, [search, auth.token, dispatch]);

  const handleClose = () => {
    setSearch("");
    setUsers([]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!search) return;

    try {
      setLoad(true);
      const res = await getDataAPI(`search?username=${search}`, auth.token);

      setUsers(res.data.users);
      setLoad(false);
    } catch (err) {
      dispatch({
        type: GLOBAL_TYPES.ALERT,
        payload: { error: err.response.data.msg },
      });
    }
  };

  return (
    <form className="search-form" onSubmit={handleSearch}>
      <input
        type="text"
        name="search"
        value={search}
        id="search"
        title="Enter to search"
        onChange={(e) => setSearch(e.target.value.replace(/ /g, ""))}
      />
      <div className="search-icon" style={{ opacity: search ? 0 : 0.3 }}>
        <span className="material-icons">search</span>
        <span>Enter to search</span>
      </div>
      <div
        className="close-search"
        style={{ opacity: users.length === 0 ? 0 : 0.4 }}
        onClick={handleClose}
      >
        <span className="material-icons">cancel</span>
      </div>
      <button type="submit" style={{ display: "none" }}>
        Search
      </button>
      {load && <img className="loading" src={LoadIcon} alt="loading" />}
      <div className="users">
        {search &&
          users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              border={"border"}
              handleClose={handleClose}
            />
          ))}
      </div>
    </form>
  );
};

export default Search;
