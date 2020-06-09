import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';

class AppointmentController {
  async index(req, res) {
    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: [
                'id',
                'path',
                'url',
              ] /** obrigado a importar o path, seão não tras a url, depende dentro da model */,
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    /** pega somente o inicio da data,
     * exemplo : 18:30:20 ele pega
     * somente o 18hrs */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({
        error: 'Past date are not permitted',
      });
    }

    const hourNow = format(hourStart, 'yyyy-mm-dd H:hh:ss');

    /** Verifica se a data é posterior ao momento atual */
    const checkAvailabity = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourNow,
      },
    });

    if (checkAvailabity) {
      return res.status(400).json({
        error: 'Appointment date ins not available',
      });
    }

    const appointments = await Appointment.create({
      user_id: req.userId,
      provider_id,
      hourNow,
    });

    return res.json(appointments);
  }
}

export default new AppointmentController();
