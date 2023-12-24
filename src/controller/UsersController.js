const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const UserRepository = require("../repositories/UserRepository")
const sqliteConnection = require("../database/sqlite");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const userRepository = new UserRepository();
    const checkUserExists = await userRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError("Este email já está em uso.");
    }
    const hachedPassword = await hash(password, 8);

    await userRepository.create({ name, email, password: hachedPassword })
    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

    if (!user) {
      throw new AppError("Usuário não encontrado.");
    }
    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este email já está em uso.");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError("Necessário informar a senha antiga.");
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);
      if (!checkOldPassword) {
        throw new AppError("Senha antiga não confere.");
      }
    }

    user.password = await hash(password, 8);

    await database.run(
      `
        UPDATE users SET
        name = ?,
        email = ?,
        updated_at = DATETIME('now')
        WHERE id = ? `,
      [user.name, user.email, user_id]
    );

    return response.status(200).json();
  }

  async index(request, response) {
    const { name, email, password } = request.body
    const database = await sqliteConnection();
    const users = await database.get("SELECT * FROM users");

    return response.status(200).json({ users });
  }
}

module.exports = UsersController;
