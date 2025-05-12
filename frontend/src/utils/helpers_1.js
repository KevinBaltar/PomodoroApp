//frontend/src/utils/helpers_1.js
/**
 * Formata um objeto Date ou uma string de data para o formato DD/MM/YYYY HH:mm.
 * @param {Date | string} dateInput - O objeto Date ou string de data a ser formatada.
 * @returns {string} A data formatada ou uma string vazia se a entrada for inválida.
 */
export const formatDateTime = (dateInput) => {
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      return ''; // Retorna string vazia para data inválida
    }
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses são baseados em zero
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error("Erro ao formatar data e hora:", error);
    return '';
  }
};

/**
 * Formata um número de segundos para o formato MM:SS.
 * @param {number} totalSeconds - O número total de segundos.
 * @returns {string} O tempo formatado como MM:SS.
 */
export const formatSecondsToMMSS = (totalSeconds) => {
  if (typeof totalSeconds !== 'number' || totalSeconds < 0) {
    return '00:00';
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Capitaliza a primeira letra de uma string.
 * @param {string} str - A string a ser capitalizada.
 * @returns {string} A string com a primeira letra maiúscula ou a string original se vazia/inválida.
 */
export const capitalizeFirstLetter = (str) => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Gera um ID único simples (não UUID).
 * Útil para chaves de componentes React ou IDs temporários.
 * @returns {string}
 */
export const generateSimpleId = () => {
  return `id_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
};

// Adicione outras funções utilitárias conforme necessário

