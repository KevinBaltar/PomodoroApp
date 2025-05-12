//backend/src/utils/helpers.js
// Funções utilitárias genéricas para o backend

/**
 * Formata um objeto Date para uma string no formato YYYY-MM-DD HH:MM:SS.
 * @param {Date} dateObject O objeto Date a ser formatado.
 * @returns {string} A data formatada.
 */
const formatDate = (dateObject) => {
  if (!(dateObject instanceof Date) || isNaN(dateObject.getTime())) {
    return "Data inválida";
  }
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Meses são 0-indexados
  const day = String(dateObject.getDate()).padStart(2, "0");
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");
  const seconds = String(dateObject.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Gera uma string aleatória de um determinado comprimento.
 * @param {number} length O comprimento da string a ser gerada.
 * @returns {string} A string aleatória.
 */
const generateRandomString = (length) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 * Escapa caracteres HTML especiais em uma string.
 * @param {string} unsafeString A string a ser escapada.
 * @returns {string} A string com caracteres HTML escapados.
 */
const escapeHTML = (unsafeString) => {
    if (typeof unsafeString !== "string") return "";
    return unsafeString
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

/**
 * Valida se uma string é um endereço de e-mail válido (validação básica).
 * Para validação robusta, considere usar bibliotecas como `validator`.
 * @param {string} email A string de e-mail a ser validada.
 * @returns {boolean} True se o e-mail for válido, false caso contrário.
 */
const isValidEmailBasic = (email) => {
  if (typeof email !== "string") return false;
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(String(email).toLowerCase());
};

/**
 * Remove espaços em branco extras de uma string (trim e múltiplos espaços internos).
 * @param {string} text A string a ser limpa.
 * @returns {string} A string limpa.
 */
const sanitizeString = (text) => {
    if (typeof text !== "string") return "";
    return text.trim().replace(/\s\s+/g, " ");
};


module.exports = {
  formatDate,
  generateRandomString,
  escapeHTML,
  isValidEmailBasic,
  sanitizeString,
};

