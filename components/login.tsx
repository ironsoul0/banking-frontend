import axios from "axios";
import { AUTH_SERVICE } from "config";
import jwtDecode from "jwt-decode";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { clsx } from "utils";

const Login = ({ setToken }: { setToken: (token: string) => void }) => {
  const [login, setLogin] = useState(true);
  const [loginInfo, setLoginInfo] = useState({ username: "", password: "" });
  const [registerInfo, setRegisterInfo] = useState({
    username: "",
    iin: "",
    password: "",
  });

  const registerUser = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.append("username", registerInfo.username);
    params.append("IIN", registerInfo.iin);
    params.append("password", registerInfo.password);

    try {
      await axios.post(`${AUTH_SERVICE}/auth/register`, params);
      toast("Successfully registered! Please login now", { type: "success" });
      setLogin(true);
    } catch {
      toast("Username or IIN is already taken", { type: "error" });
    }
  };

  const loginUser = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.append("username", loginInfo.username);
    params.append("password", loginInfo.password);

    try {
      const response = await axios.post(`${AUTH_SERVICE}/auth/login`, params);
      const token = response.data.access;

      localStorage.setItem("token", token);
      setToken((jwtDecode(token) as { payload: string }).payload);

      toast("Successfully signed in! ", { type: "success" });
    } catch {
      toast("Credentials are invalid", { type: "error" });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-80">
        <div className="flex items-center mb-4">
          <h3 className="text-2xl font-bold">Go Bank</h3>
        </div>
        <div className="flex bg-gray-200">
          <button
            onClick={() => setLogin(true)}
            className={clsx(
              "flex-grow block py-2",
              login && "ring-2 ring-green-400"
            )}
          >
            Login
          </button>
          <button
            onClick={() => setLogin(false)}
            className={clsx(
              "flex-grow block py-2",
              !login && "ring-2 ring-green-400"
            )}
          >
            Register
          </button>
        </div>
        <div className="mt-4">
          {login && (
            <form>
              <input
                type="text"
                className="w-full px-2 py-1 border-2 outline-none"
                placeholder="Username"
                value={loginInfo.username}
                onChange={(e) =>
                  setLoginInfo({ ...loginInfo, username: e.target.value })
                }
              />
              <input
                type="password"
                className="w-full px-2 py-1 mt-2 border-2 outline-none"
                placeholder="Password"
                value={loginInfo.password}
                onChange={(e) =>
                  setLoginInfo({ ...loginInfo, password: e.target.value })
                }
              />
              <button
                className="w-full py-2 mt-2 text-center bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-80 transition-opacity"
                type="submit"
                disabled={!loginInfo.username || !loginInfo.password}
                onClick={loginUser}
              >
                Submit
              </button>
            </form>
          )}
          {!login && (
            <form onSubmit={registerUser}>
              <input
                type="text"
                className="w-full px-2 py-1 border-2 outline-none"
                placeholder="Username"
                value={registerInfo.username}
                onChange={(e) =>
                  setRegisterInfo({ ...registerInfo, username: e.target.value })
                }
              />
              <input
                type="iin"
                className="w-full px-2 py-1 mt-2 border-2 outline-none"
                placeholder="IIN (12 digits)"
                value={registerInfo.iin}
                onChange={(e) =>
                  setRegisterInfo({ ...registerInfo, iin: e.target.value })
                }
              />
              <input
                type="password"
                className="w-full px-2 py-1 mt-2 border-2 outline-none"
                placeholder="Password"
                value={registerInfo.password}
                onChange={(e) =>
                  setRegisterInfo({ ...registerInfo, password: e.target.value })
                }
              />
              <button
                className="w-full py-2 mt-2 text-center bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-80 transition-opacity"
                type="submit"
                disabled={
                  !registerInfo.username ||
                  registerInfo.iin?.length !== 12 ||
                  !registerInfo.password
                }
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
