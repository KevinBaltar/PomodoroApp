//frontend/src/integrations/openai.js
import { Alert } from 'react-native';

// Esta seria a chave da API da OpenAI, idealmente vinda de variáveis de ambiente seguras.
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'SUA_CHAVE_API_OPENAI_AQUI';

/**
 * Função para obter insights de produtividade da OpenAI (simulado).
 * Em uma implementação real, faria uma chamada para a API da OpenAI com dados do usuário.
 * @param {object} userData - Dados do usuário (ex: histórico de pomodoros, tarefas concluídas).
 * @returns {Promise<string[]>} - Uma promessa que resolve para uma lista de insights.
 */
const getProductivityInsights = async (userData) => {
  console.log('Obtendo insights de produtividade para:', userData.userId);

  // Simulação de chamada à API
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockInsights = [
        `Olá, ${userData.name || 'Usuário'}! Parece que você é mais produtivo(a) nas manhãs.`,
        'Tente agendar suas tarefas mais complexas para o período da manhã.',
        'Lembre-se de fazer pausas regulares para manter o foco e a energia.',
        'Você completou uma média de X pomodoros por dia esta semana. Continue assim!',
      ];
      // Em um caso real, aqui você faria a requisição HTTP para a OpenAI:
      // try {
      //   const response = await fetch('https://api.openai.com/v1/chat/completions', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer ${OPENAI_API_KEY}`,
      //     },
      //     body: JSON.stringify({
      //       model: 'gpt-3.5-turbo', // ou outro modelo
      //       messages: [
      //         { role: 'system', content: 'Você é um assistente de produtividade que fornece insights concisos.' },
      //         { role: 'user', content: `Analise estes dados de produtividade e forneça 3 insights: ${JSON.stringify(userData.stats)}` }
      //       ],
      //       max_tokens: 150,
      //     }),
      //   });
      //   const data = await response.json();
      //   if (data.choices && data.choices.length > 0) {
      //     const insightsText = data.choices[0].message.content;
      //     resolve(insightsText.split('\n').filter(line => line.trim() !== ''));
      //   } else {
      //     resolve(['Não foi possível gerar insights no momento.']);
      //   }
      // } catch (error) {
      //   console.error('Erro ao buscar insights da OpenAI:', error);
      //   Alert.alert('Erro OpenAI', 'Não foi possível conectar ao serviço de IA.');
      //   resolve(['Erro ao obter insights.']);
      // }
      resolve(mockInsights);
    }, 1500);
  });
};

/**
 * Função para sugerir a próxima tarefa com base no histórico e IA (simulado).
 * @param {object[]} tasks - Lista de tarefas pendentes.
 * @param {object} userPreferences - Preferências do usuário.
 * @returns {Promise<object|null>} - Uma promessa que resolve para a tarefa sugerida ou null.
 */
const suggestNextTask = async (tasks, userPreferences) => {
  console.log('Sugerindo próxima tarefa com base em:', tasks.length, 'tarefas e preferências:', userPreferences);
  // Lógica simulada: sugere a primeira tarefa pendente com alta prioridade
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!tasks || tasks.length === 0) {
        resolve(null);
        return;
      }
      const highPriorityTasks = tasks.filter(t => t.priority === 'alta' && t.status !== 'concluida');
      if (highPriorityTasks.length > 0) {
        resolve(highPriorityTasks[0]);
      } else {
        const pendingTasks = tasks.filter(t => t.status !== 'concluida');
        resolve(pendingTasks.length > 0 ? pendingTasks[0] : null);
      }
    }, 1000);
  });
};

export { getProductivityInsights, suggestNextTask };

