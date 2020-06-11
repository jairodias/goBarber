import Notification from '../models/Notification';
import User from '../models/User';
import Appointment from '../models/Appointment';

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
      order: [['id', 'DESC']],
      limit: 20,
    });

    return res.json(notifications);
  }

  async update(req, res) {
    try {
      const newNotification = await Notification.update(
        { read: true },
        { where: { id: req.params.id } }
      );

      const notification = await Notification.findOne({
        where: { id: req.params.id },
      });

      return res.status(200).json(notification);
    } catch (err) {
      res.status(401).json({ error: 'Request failed' });
    }
  }
}

export default new NotificationController();
