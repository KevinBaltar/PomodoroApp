//backend/src/controllers/taskController.js
const Tarefa = require("../models/Tarefa");
const SessaoPomodoro = require("../models/SessaoPomodoro");

// Criar uma nova tarefa
exports.createTask = async (req, res, next) => {
  try {
    const { titulo, descricao, data_prazo, prioridade, pomodoros_estimados, tags } = req.body;

    if (!titulo) {
      return res.status(400).json({ status: "fail", message: "O título da tarefa é obrigatório." });
    }

    const newTask = await Tarefa.create({
      usuario_id: req.user.id, // req.user populado pelo authController.protect
      titulo,
      descricao,
      data_prazo,
      prioridade,
      pomodoros_estimados,
      tags,
    });

    res.status(201).json({
      status: "success",
      data: {
        tarefa: newTask,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ status: "fail", message: messages.join('. ') });
    }
    console.error("Erro ao criar tarefa: ", error);
    res.status(500).json({ status: "error", message: "Erro ao criar tarefa." });
  }
};

// Obter todas as tarefas do usuário logado
exports.getAllTasks = async (req, res, next) => {
  try {
    // Filtros podem ser adicionados via query params, ex: /tasks?status=pendente&prioridade=alta
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach(el => delete queryObj[el]);

    // Adicionar filtro para o usuário logado
    queryObj.usuario_id = req.user.id;

    let query = Tarefa.find(queryObj);

    // Ordenação
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort("-data_criacao"); // Padrão: mais recentes primeiro
    }

    // Paginação (exemplo básico)
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100; // Padrão de 100 tarefas por página
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const tasks = await query;

    res.status(200).json({
      status: "success",
      results: tasks.length,
      data: {
        tarefas: tasks,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar tarefas: ", error);
    res.status(500).json({ status: "error", message: "Erro ao buscar tarefas." });
  }
};

// Obter uma tarefa específica pelo ID
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Tarefa.findOne({ _id: req.params.taskId, usuario_id: req.user.id });

    if (!task) {
      return res.status(404).json({ status: "fail", message: "Tarefa não encontrada." });
    }

    res.status(200).json({
      status: "success",
      data: {
        tarefa: task,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar tarefa por ID: ", error);
    res.status(500).json({ status: "error", message: "Erro ao buscar tarefa." });
  }
};

// Atualizar uma tarefa
exports.updateTask = async (req, res, next) => {
  try {
    const { titulo, descricao, data_prazo, status, prioridade, pomodoros_estimados, pomodoros_realizados, tags } = req.body;

    const allowedUpdates = {
        titulo,
        descricao,
        data_prazo,
        status,
        prioridade,
        pomodoros_estimados,
        pomodoros_realizados,
        tags
    };

    Object.keys(allowedUpdates).forEach(key => allowedUpdates[key] === undefined && delete allowedUpdates[key]);

    if (Object.keys(allowedUpdates).length === 0) {
        return res.status(400).json({ status: "fail", message: "Nenhum dado fornecido para atualização da tarefa." });
    }

    const updatedTask = await Tarefa.findOneAndUpdate(
      { _id: req.params.taskId, usuario_id: req.user.id },
      allowedUpdates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({ status: "fail", message: "Tarefa não encontrada para atualização." });
    }

    res.status(200).json({
      status: "success",
      data: {
        tarefa: updatedTask,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ status: "fail", message: messages.join('. ') });
    }
    console.error("Erro ao atualizar tarefa: ", error);
    res.status(500).json({ status: "error", message: "Erro ao atualizar tarefa." });
  }
};

// Deletar uma tarefa
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Tarefa.findOneAndDelete({ _id: req.params.taskId, usuario_id: req.user.id });

    if (!task) {
      return res.status(404).json({ status: "fail", message: "Tarefa não encontrada para exclusão." });
    }

    // Opcional: Desassociar sessões Pomodoro desta tarefa ou marcá-las de alguma forma
    // await SessaoPomodoro.updateMany({ tarefa_id: req.params.taskId }, { $set: { tarefa_id: null } });

    res.status(204).json({ // 204 No Content
      status: "success",
      data: null,
    });
  } catch (error) {
    console.error("Erro ao deletar tarefa: ", error);
    res.status(500).json({ status: "error", message: "Erro ao deletar tarefa." });
  }
};
