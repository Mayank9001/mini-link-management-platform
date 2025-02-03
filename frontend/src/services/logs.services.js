const URL = import.meta.env.VITE_BACKEND_URL;

export const getlogs = async () => {
  return await fetch(`${URL}/logs/getlogs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
