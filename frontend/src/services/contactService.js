import api from "./api";

export const getAllContacts = async () => {
  const response = await api.get("/contacts");
  return response.data;
};

export const getContactById = async (id) => {
  const response = await api.get(`/contacts/${id}`);
  return response.data;
};

export const createContact = async (data) => {
  const response = await api.post("/contacts", data);
  return response.data;
};

export const updateContact = async (id, data) => {
  const response = await api.put(`/contacts/${id}`, data);
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
};

export const searchContacts = async (params) => {
  const response = await api.get("/contacts/search", {
    params,
  });

  return response.data;
};
