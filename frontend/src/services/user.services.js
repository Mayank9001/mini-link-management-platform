const URL = import.meta.env.VITE_BACKEND_URL;

// login
export const userLogin = async (data) => {
  return await fetch(`${URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const userRegister = async (data) => {
  return await fetch(`${URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const userUpdate = async (data) => {
  return await fetch(`${URL}/user/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
};

export const userDelete = async () => {
  return await fetch(`${URL}/user/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};

export const userDashboard = async () => {
  return await fetch(`${URL}/user/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
