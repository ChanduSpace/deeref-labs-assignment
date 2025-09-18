import api from "./api";

export const pdfAPI = {
  upload: (formData) => {
    return api.post("/pdfs/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getAll: () => {
    return api.get("/pdfs");
  },
  getOne: (uuid) => {
    return api.get(`/pdfs/${uuid}`);
  },
  delete: (uuid) => {
    return api.delete(`/pdfs/${uuid}`);
  },
  rename: (uuid, originalName) => {
    return api.put(`/pdfs/${uuid}/rename`, { originalName });
  },
};

export const highlightsAPI = {
  create: (data) => {
    return api.post("/highlights", data);
  },
  getForPDF: (uuid) => {
    return api.get(`/highlights/${uuid}`);
  },
  update: (id, data) => {
    return api.put(`/highlights/${id}`, data);
  },
  delete: (id) => {
    return api.delete(`/highlights/${id}`);
  },
};
