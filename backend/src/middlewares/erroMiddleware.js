//backend/src/middlewares/errorMiddleware.js
// Middleware para tratamento global de erros
// Este middleware deve ser adicionado APÓS todas as outras rotas e middlewares no seu arquivo server.js

const errorMiddleware = (err, req, res, next) => {
  console.error("\n--- ERRO CAPTURADO PELO MIDDLEWARE ---");
  console.error("Timestamp:", new Date().toISOString());
  console.error("Rota:", `${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.error("Corpo da Requisição:", JSON.stringify(req.body, null, 2));
  }
  console.error("Mensagem do Erro:", err.message);
  console.error("Stack do Erro:", err.stack);
  console.error("--- FIM DO LOG DE ERRO ---\n");

  // Define um status code padrão para o erro, caso não seja especificado
  const statusCode = err.statusCode || 500;

  // Define uma mensagem de erro padrão
  const message = err.message || "Ocorreu um erro interno no servidor.";

  // Em ambiente de desenvolvimento, pode ser útil enviar mais detalhes do erro
  // Em produção, evite expor detalhes sensíveis do erro
  if (process.env.NODE_ENV === "development") {
    res.status(statusCode).json({
      status: "error",
      statusCode,
      message,
      stack: err.stack, // Enviar o stack trace apenas em desenvolvimento
      error: err // Pode incluir o objeto de erro completo para depuração
    });
  } else {
    // Em produção, envie uma mensagem genérica
    res.status(statusCode).json({
      status: "error",
      statusCode,
      message: statusCode === 500 ? "Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde." : message,
    });
  }
};

module.exports = errorMiddleware;

