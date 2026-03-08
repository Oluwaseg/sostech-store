import { User } from '../models/User';

class AdminService {
  async getAllUsers() {
    return User.find({}, '-password').lean();
  }

  async editUser(userId: string, update: Partial<any>) {
    // Prevent password update here, use dedicated endpoint
    if ('password' in update) delete update.password;
    return User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
    })
      .select('-password')
      .lean();
  }

  async deleteUser(userId: string) {
    return User.findByIdAndDelete(userId);
  }
}

export default new AdminService();
