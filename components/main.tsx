import { TX_SERVICE } from "config";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { axiosWithToken, clsx } from "utils";

import Arrow from "./arrow";

type Response<T> =
  | { type: "loading" }
  | { type: "fetched"; payload: T }
  | { type: "error"; payload?: string };

type Transfer = {
  to_wallet_code: string;
  amount: number;
  created_at: string;
};

type Wallet = {
  id: number;
  owner: number;
  code: string;
  created_at: string;
  balance: number;
  transfers: Transfer[];
};

type Props = {
  id: string;
  username: string;
  iin: string;
  role: string;
  token: string;
  setToken: (token: string | null) => void;
};

const formatCode = (code: string) => {
  const parts = [];
  for (let i = 0; i < code.length; i += 4) {
    parts.push(code.substring(i, i + 4));
  }
  return parts.join(" ");
};

const Main = ({ id, username, iin, role, setToken }: Props) => {
  const [wallets, setWallets] = useState<Response<Wallet[]>>({
    type: "loading",
  });
  const [target, setTarget] = useState<number | null>(null);
  const [topUpAmount, setTopUpAmount] = useState<number | string | undefined>();
  const [transfer, setTransfer] = useState<{
    target: undefined | string;
    amount: undefined | string | number;
  }>({
    target: undefined,
    amount: undefined,
  });

  const fetchWallets = useCallback(async () => {
    const axios = axiosWithToken();
    const response = await axios.get(`${TX_SERVICE}/wallets`);
    setWallets({
      type: "fetched",
      payload: response.data,
    });
  }, []);

  const createWallet = useCallback(async () => {
    const axios = axiosWithToken();
    try {
      await axios.post(`${TX_SERVICE}/wallet`);
      toast("Successfully created new wallet", { type: "success" });
      fetchWallets();
    } catch {
      toast("Creating wallet has failed. Please try again", {
        type: "error",
      });
    }
  }, [fetchWallets]);

  const logout = useCallback(async () => {
    setToken(null);
    localStorage.removeItem("token");
  }, [setToken]);

  const pickWallet = useCallback(
    (id: number) => {
      if (target === id) {
        setTarget(null);
        return;
      }
      setTarget(id);
    },
    [setTarget, target]
  );

  const topUp = useCallback(
    async (code: string) => {
      const axios = axiosWithToken();
      await axios.post(`${TX_SERVICE}/replenish`, {
        wallet_code: code,
        amount: topUpAmount,
      });
      toast("Successfully replenished the wallet", { type: "success" });
      fetchWallets();
      setTopUpAmount("");
    },
    [topUpAmount, fetchWallets]
  );

  const transferMoney = useCallback(
    async (code: string) => {
      const axios = axiosWithToken();
      try {
        await axios.post(`${TX_SERVICE}/transfer`, {
          from_wallet_code: code,
          to_wallet_code: transfer.target?.split(" ").join(""),
          amount: transfer.amount,
        });
        toast("Successfully sent the transaction", { type: "success" });
        fetchWallets();
        setTransfer({ target: "", amount: "" });
      } catch {
        toast("Wallet with this code does not exist", { type: "error" });
      }
    },
    [transfer, fetchWallets]
  );

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  return (
    <div>
      <ToastContainer />
      <div className="max-w-lg py-5 mx-auto">
        <h3 className="text-3xl font-bold">Dashboard</h3>
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <img
              src={`https://i.pravatar.cc/150?img=${id}`}
              className="w-16 h-16 mt-2 mr-4 rounded-full"
              alt="Avatar"
            />
            <div>
              <p className="mt-3 mb-1 text-lg leading-3">
                <span className="font-bold">Username: </span>
                {username} {`(${role})`}
              </p>
              <p className="py-0 my-0 text-lg">
                <span className="font-bold">IIN: </span>
                {iin}
              </p>
            </div>
          </div>
          <button
            className="px-4 py-2 bg-red-400 rounded-md hover:opacity-90 transition-all"
            onClick={logout}
          >
            Logout
          </button>
        </div>
        <h3 className="mt-8 text-2xl font-bold">My Wallets</h3>
        {wallets.type === "fetched" &&
          wallets.payload.map((wallet) => (
            <div key={wallet.code} className="mb-5">
              <button
                className="flex items-center justify-between w-full px-4 py-3 mt-2 mb-2 text-left bg-gray-200 rounded-md"
                onClick={() => pickWallet(wallet.id)}
              >
                <div>
                  <p>Code: {formatCode(wallet.code)}</p>
                  <p>Balance: {wallet.balance}$</p>
                  <p>
                    Date of creation:{" "}
                    {new Date(wallet.created_at).toLocaleString()}
                  </p>
                </div>
                <Arrow
                  className={clsx(
                    "transform transition-all",
                    target === wallet.id && "rotate-180"
                  )}
                />
              </button>
              {target === wallet.id && (
                <div className="px-4 py-3 mb-5 bg-gray-100 rounded-md">
                  <p className="font-bold">List of transactions:</p>
                  <div className="mb-6">
                    {wallet.transfers.map((transfer, i) => (
                      <div key={i}>
                        <p>
                          {transfer.amount}$ to{" "}
                          {formatCode(transfer.to_wallet_code)} on{" "}
                          {new Date(transfer.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                    {wallet.transfers.length === 0 && (
                      <p>No transactions yet</p>
                    )}
                  </div>
                  <div className="flex mt-2 mb-3">
                    <input
                      type="number"
                      className="px-2 py-1 text-sm bg-transparent border-black outline-none appearance-none focus:ring-2 ring-blue-300 ring-1"
                      placeholder="200$"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(parseInt(e.target.value))}
                    />
                    <button
                      className="block px-2 py-1 ml-3 text-sm bg-blue-300 outline-none hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!topUpAmount}
                      onClick={() => topUp(wallet.code)}
                    >
                      Top up
                    </button>
                  </div>
                  <div className="flex mt-2">
                    <input
                      type="text"
                      className="px-2 py-1 text-sm bg-transparent border-black outline-none appearance-none focus:ring-2 ring-blue-300 ring-1"
                      placeholder="5169 4931 2165"
                      value={transfer.target}
                      onChange={(e) =>
                        setTransfer({ ...transfer, target: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      className="w-16 px-2 py-1 ml-3 text-sm bg-transparent border-black outline-none appearance-none focus:ring-2 ring-blue-300 ring-1"
                      placeholder="50$"
                      value={transfer.amount}
                      onChange={(e) =>
                        setTransfer({
                          ...transfer,
                          amount: parseInt(e.target.value),
                        })
                      }
                    />
                    <button
                      className="block px-2 py-1 ml-3 text-sm bg-purple-300 outline-none hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => transferMoney(wallet.code)}
                      disabled={
                        !transfer.amount ||
                        !transfer.target ||
                        transfer.amount > wallet.balance ||
                        transfer.target?.length !== 14
                      }
                    >
                      Transfer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        {wallets.type === "fetched" && wallets.payload.length === 0 && (
          <p className="mt-2 mb-3">
            You do not have any wallets yet. Please create one
          </p>
        )}
        {wallets.type === "loading" && (
          <p className="mt-2 mb-3">Loading the wallets..</p>
        )}
        <button
          className="px-4 py-2 mb-6 bg-green-300 rounded-md hover:opacity-90 transition-all"
          onClick={createWallet}
        >
          Create wallet
        </button>
      </div>
    </div>
  );
};

export default Main;
