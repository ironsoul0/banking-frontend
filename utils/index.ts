import axios from "axios";

export const clsx = (...values: unknown[]) => {
  let result = "";
  for (const value of values) {
    if (typeof value === "string") {
      result += " " + value;
    }
    if (Array.isArray(value)) {
      result += " " + value.join(" ");
    }
  }
  return result;
};

export const axiosWithToken = () => {
  return axios.create({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
