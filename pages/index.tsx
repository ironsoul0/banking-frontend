import "react-toastify/dist/ReactToastify.css";

import Login from "components/login";
import Main from "components/main";
import jwtDecode from "jwt-decode";
import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";

const IndexPage = () => {
  const [token, setToken] = useState<string | null>();
  const payload = useMemo(() => {
    if (!token) return undefined;

    const { id, role, iin, username } = JSON.parse(token);
    return {
      id,
      role,
      iin,
      username,
    };
  }, [token]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken((jwtDecode(storedToken) as { payload: string }).payload);
    }
  }, [setToken]);

  if (payload && token) {
    return <Main {...payload} token={token} setToken={setToken} />;
  }

  return (
    <div>
      <ToastContainer />
      <Login setToken={setToken} />
    </div>
  );
};

export default IndexPage;
