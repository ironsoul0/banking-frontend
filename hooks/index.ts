import { useEthers } from "@usedapp/core";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";

import { API_URL } from "../config";

type Profile = {
  address: string;
  username: string;
};

type Response<T> =
  | { type: "loading" }
  | { type: "fetched"; payload: T }
  | { type: "error"; payload?: string };

export const useProfile = () => {
  const { account } = useEthers();
  const [profile, setProfile] = useState<Response<Profile>>({
    type: "loading",
  });

  const getProfile = useCallback(async () => {
    if (!account) return;
    setProfile({ type: "loading" });
    try {
      const { data } = await axios.get<Profile>(
        `${API_URL}/api/user?address=${account}`
      );
      setProfile({ type: "fetched", payload: data });
    } catch {
      setProfile({ type: "error" });
    }
  }, [account]);

  const createProfile = useCallback(
    async (username: string, address: string, signature: string) => {
      setProfile({ type: "loading" });

      try {
        await axios.post(`${API_URL}/api/user/signup`, {
          username,
          address,
          signature,
        });

        getProfile();
      } catch (e) {
        if (!axios.isAxiosError(e)) return;
        setProfile({ type: "error", payload: e.response?.data.message });
      }
    },
    [getProfile]
  );

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return {
    createProfile,
    getProfile,
    profile,
  };
};
