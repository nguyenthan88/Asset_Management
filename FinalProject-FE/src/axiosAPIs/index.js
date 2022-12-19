import axios from 'axios';
import { BASE_URL, TOKEN_KEY } from '../constants';

export const getAllData = async (url) => {
  let data = [];
  await axios({
    method: 'get',
    url: `${BASE_URL}/${url}`,
    headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
    data: null,
  })
    .then((response) => {
      data = [...response.data];
    })
    .catch((err) => {
      console.log({ err });
    });
  return data;
};

export const changePassword = async (url, data) => {
  let response = undefined;
  await axios({
    method: 'post',
    url: `${BASE_URL}/${url}`,
    headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
    data: {
      userName: data.userName,
      newPassword: data.newPassword,
    },
  })
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      response = err;
    });
  return response;
};

export const getAllUser = async (url, username) => {
  let data = [];
  await axios({
    method: 'get',
    url: `https://rookiesb6g5-api.azurewebsites.net/api/user-management?userName=tuananh`,

    data: null,
  })
    .then((response) => {
      data = [...response.data];
    })
    .catch((err) => {
      console.log({ err });
    });
  return data;
};

export const deleteData = async (url, id) => {
  let data = [];
  await axios({
    method: 'delete',
    url: `${BASE_URL}/${url}/${id}`,
    headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
    data: null,
  })
    .then((response) => {
      data = response.data;
    })
    .catch((err) => {
      data = err.response.data;
    });
  return data;
};

export const checkValidUser = async (url, id) => {
  let data = [];
  await axios({
    method: 'post',
    url: `${BASE_URL}/${url}/${id}`,
    headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
    data: null,
  })
    .then((response) => {
      data = response.data;
    })
    .catch((err) => {
      data = err.response.data;
    });
  return data;
};

export const createRequest = async (url, data) => {
  let response = undefined;
  await axios({
    method: 'post',
    url: `${BASE_URL}/${url}`,
    headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
    data: {
      userId: localStorage.getItem('userId'),
      assignmentId: data.id,
    },
  })
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      response = err;
    });
  return response;
};

export const acceptAssignment = async (url, id) => {
  let data = [];
  await axios({
    method: 'put',
    url: `${BASE_URL}/${url}/${id}`,
    headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
    data: null,
  })
    .then((response) => {
      data = response.data;
    })
    .catch((err) => {
      data = err.response.data;
    });
  return data;
};

export const declineAssignment = async (url, id) => {
  let data = [];
  await axios({
    method: 'put',
    url: `${BASE_URL}/${url}/${id}`,
    headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
    data: null,
  })
    .then((response) => {
      data = response.data;
    })
    .catch((err) => {
      data = err.response.data;
    });
  return data;
};

export const createData = async (url, data) => {
  let response = [];
  await axios({
    method: 'post',
    url: `${BASE_URL}/${url}`,
    headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
    data: data,
  })
    .then((res) => {
      response = [...res.data];
    })
    .catch((err) => {
      response = err;
    });
  return response;
};

export const updateData = async (url, data) => {
  let response = [];
  await axios({
    method: 'put',
    url: `${BASE_URL}/${url}`,
    headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
    data: data,
  })
    .then((res) => {
      response = [...res.data];
    })
    .catch((err) => {
      console.log({ err });
    });
  return response;
};
