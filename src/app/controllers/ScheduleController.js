import Appointment from '../model/Appointment';

class ScheduleController {
  async index(req, res) {
    return res.json({ ok: true });
  }
}

export default new ScheduleController();
