import api from "./api";

export const createInteraction = async (data) => {
  const response = await api.post(
    "/interactions",
    data
  );

  return response.data;
};

export const getInteractionsByContact = async (
  contactId
) => {
  const response = await api.get(
    `/contacts/${contactId}/interactions`
  );

  return response.data;
};

export const deleteInteraction = async (id) => {
  const response = await api.delete(
    `/interactions/${id}`
  );

  return response.data;
};
