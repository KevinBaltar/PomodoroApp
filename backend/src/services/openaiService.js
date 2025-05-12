const OpenAI = require('openai');
const SessaoPomodoro = require('../models/SessaoPomodoro');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateProductivityInsights = async (userId) => {
  const sessions = await SessaoPomodoro.find({ 
    usuario_id: userId,
    status: "concluida"
  }).sort({ data_inicio: -1 }).limit(50);

  if (sessions.length < 5) {
    return ["Colete mais dados para gerar insights personalizados"];
  }

  const prompt = `
    Analise estes dados de produtividade e forneça 3 insights concisos em português:
    - Total de sessões: ${sessions.length}
    - Média de minutos por dia: ${calculateAverage(sessions)}min
    - Horário mais produtivo: ${findPeakHours(sessions)}
    
    Forneça insights acionáveis baseados nestes dados. Seja direto e use marcadores.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200
  });

  return response.choices[0].message.content.split('\n').filter(line => line.trim());
};

// Funções auxiliares (implementar em outro arquivo)
function calculateAverage(sessions) {
  // Implementar lógica
}

function findPeakHours(sessions) {
  // Implementar lógica
}

module.exports = { generateProductivityInsights };