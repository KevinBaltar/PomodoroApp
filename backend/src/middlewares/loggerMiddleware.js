//backend/src/middlewares/loggerMiddleware.js
// Middleware para logging de requisições HTTP
// Pode ser usado com bibliotecas como Morgan ou Winston para logging mais avançado

const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  // Loga informações da requisição
  console.log("\n--- NOVA REQUISIÇÃO ---");
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Método: ${req.method}`);
  console.log(`URL: ${req.originalUrl}`);
  console.log(`IP Remoto: ${req.ip || req.connection.remoteAddress}`);
  if (req.headers["user-agent"]) {
    console.log(`User-Agent: ${req.headers["user-agent"]}`);
  }
  if (req.body && Object.keys(req.body).length > 0) {
    // Cuidado ao logar o corpo da requisição em produção, pode conter dados sensíveis
    // Considere logar apenas chaves ou um resumo, ou omitir em produção para certos endpoints
    console.log("Corpo da Requisição (parcial):", JSON.stringify(Object.keys(req.body)));
  }

  // Captura o evento de finalização da resposta para logar informações da resposta
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log("--- RESPOSTA ENVIADA ---");
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Duração: ${duration}ms`);
    console.log("--- FIM DA REQUISIÇÃO ---\n");
  });

  // Continua para o próximo middleware ou rota
  next();
};

module.exports = loggerMiddleware;

