// utils/tokenService.js

const TokenService = {
  getAccessToken: () => {
    return localStorage.getItem('access_token');
  },
  
  setAccessToken: (token) => {
    localStorage.setItem('access_token', token);
  },
  
  removeAccessToken: () => {
    localStorage.removeItem('access_token');
  },
  
  // Проверка, истек ли токен (если у вас есть JWT и можно парсить)
  isTokenExpired: (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return false;
    }
  }
};

export default TokenService;