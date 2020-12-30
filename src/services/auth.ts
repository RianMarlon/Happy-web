import api from './api';

export const TOKEN_KEY = '@happy/user';

export const hasToken = () => {
  const tokenLocalStorage = localStorage.getItem(TOKEN_KEY);
  const tokenSessionStorage = sessionStorage.getItem(TOKEN_KEY);

  return !!tokenLocalStorage || !!tokenSessionStorage
};

export const hasTokenValid = async () => {
  if(hasToken()) {
    const tokenLocalStorage = localStorage.getItem(TOKEN_KEY);
    const tokenSessionStorage = sessionStorage.getItem(TOKEN_KEY);

    const hasTokenInLocalStorage = tokenLocalStorage !== null;
    const hasTokenInSessionStorage = tokenSessionStorage !== null;

    if (hasTokenInLocalStorage) {
      const data = {
        token: tokenLocalStorage
      }

      const response = await api.post('/validate-token', data);
      const { is_token_valid: isTokenValid, is_admin: isAdmin } = response.data;

      if (!isTokenValid) {
        localStorage.removeItem(TOKEN_KEY);
      }

      return {
        isTokenValid,
        isAdmin
      };
    }

    if (hasTokenInSessionStorage) {
      const data = {
        token: tokenSessionStorage
      }

      const response = await api.post('/validate-token', data);
      const { is_valid_token: isTokenValid, is_admin: isAdmin } = response.data;
      
      if (!isTokenValid) {
        sessionStorage.removeItem(TOKEN_KEY);
      }
      
      return {
        isTokenValid,
        isAdmin
      };
    }
  }

  else {
    return {
      isTokenValid: false,
      isAdmin: false
    };
  }
};

export const getToken = () => {
  const tokenLocalStorage = localStorage.getItem(TOKEN_KEY);
  const tokenSessionStorage = sessionStorage.getItem(TOKEN_KEY);

  return tokenLocalStorage || tokenSessionStorage;
};

export const removeToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
};
