import Notification from '../models/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res.status(401).json({
        error: 'Only provider can load notifications',
      });
    }

    const notifications = await Notification.findAll({
      where: { user: req.userId },
      order: ['date'],
      limit: 20,
    });

    return res.json(notifications);
  }
}

export default new NotificationController();
