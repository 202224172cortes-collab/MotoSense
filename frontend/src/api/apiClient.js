const API_URL = "http://127.0.0.1:5000/api";

export const apiClient = {

  // ==========================
  // AUTH
  // ==========================

  async register(email, password) {

    const response = await fetch(
      `${API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Error al registrar"
      );
    }

    return data;
  },

  async login(email, password) {

    const response = await fetch(
      `${API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Credenciales inválidas"
      );
    }

    localStorage.setItem(
      "user",
      JSON.stringify(data)
    );

    return data;
  },

  async logout() {

    localStorage.removeItem("user");

    return true;
  },

  async getCurrentUser() {

    const user = localStorage.getItem("user");

    return user
      ? JSON.parse(user)
      : null;
  },

  // ==========================
  // ANALYSIS
  // ==========================

  async getAnalyses(userId) {

  const response = await fetch(
    `${API_URL}/analysis/?user_id=${userId}`
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Error obteniendo análisis"
    );
  }

  return data;
},

  async createAnalysis(payload) {

    const response = await fetch(
      `${API_URL}/analysis/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Error creando análisis"
      );
    }

    return data;
  },

  async getAnalysisById(id) {

    const response = await fetch(
      `${API_URL}/analysis/${id}`
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Error obteniendo análisis"
      );
    }

    return data;
  },

  // ==========================
  // MEMBERSHIP
  // ==========================

  async getMemberships() {

    const response = await fetch(
      `${API_URL}/membership`
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Error obteniendo membresías"
      );
    }

    return data;
  },

  async getMembership(userId) {

    const response = await fetch(
      `${API_URL}/membership/${userId}`
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Error obteniendo membresía"
      );
    }

    return data;
  },

  async getFolders() {

  const response = await fetch(
    "http://127.0.0.1:5000/api/admin/folders"
  );

  return await response.json();
},

async createFolder(data) {

  const response = await fetch(
    "http://127.0.0.1:5000/api/admin/folders",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  return await response.json();
},

//Funcion de archivos en adminBase
async getFolderAudios(folderId) {

  const response = await fetch(
    `http://127.0.0.1:5000/api/admin/folder/${folderId}/audios`
  );

  return await response.json();
},
async uploadAudio(file) {

  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  const response = await fetch(
    "http://127.0.0.1:5000/api/admin/upload-audio",
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Error analizando audio"
    );
  }

  return data;
},
async deleteFolder(folderId) {
  return fetch(
    `${API_URL}/admin/folders/${folderId}`,
    {
      method: "DELETE"
    }
  );
}

};