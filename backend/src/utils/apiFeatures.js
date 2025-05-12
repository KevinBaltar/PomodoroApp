//backend/src/utils/apiFeatures.js
class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query (e.g., Product.find())
    this.queryString = queryString; // Query string from Express (req.query)
  }

  filter() {
    // 1A) Filtragem básica (excluindo campos especiais)
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Filtragem avançada (gte, gt, lte, lt)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // Exemplo: { price: { gte: '50' } } se torna { price: { $gte: '50' } }

    this.query = this.query.find(JSON.parse(queryStr));

    return this; // Retorna o objeto inteiro para encadear métodos
  }

  sort() {
    if (this.queryString.sort) {
      // Para ordenar por múltiplos campos: sort="+price,-ratingsAverage"
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // Ordenação padrão (ex: por data de criação, decrescente)
      this.query = this.query.sort("-createdAt"); // ou -dataCriacao, dependendo do seu modelo
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      // Para selecionar campos específicos: fields="name,price,description"
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      // Excluir campos padrão (ex: __v do Mongoose)
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; // Converte para número, padrão 1
    const limit = this.queryString.limit * 1 || 100; // Padrão 100 resultados por página
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    // Opcional: verificar se a página solicitada existe (requer countDocuments antes)
    // if (this.queryString.page) {
    //   const numDocuments = await this.query.model.countDocuments(); // Cuidado, executa uma query extra
    //   if (skip >= numDocuments) throw new Error('Esta página não existe');
    // }

    return this;
  }

  // Método para executar a query e retornar os documentos e metadados de paginação
  async execute() {
    const totalQuery = this.query.model.countDocuments(this.query.getFilter()); // Query para contar o total de documentos que correspondem ao filtro
    const total = await totalQuery;

    const results = await this.query; // Executa a query principal com filtros, sort, fields, paginate

    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const totalPages = Math.ceil(total / limit);

    return {
      results,
      total,
      page,
      limit,
      totalPages,
    };
  }
}

module.exports = APIFeatures;

