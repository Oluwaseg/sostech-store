import { User } from '../models/User';

class AdminService {
  async getAllUsers() {
    return User.find({}, '-password').lean();
  }
}

export default new AdminService();
