import { db } from "../models/index.js";
const Appointment = db.appointment;
const User = db.user;
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear.js";

dayjs.extend(weekOfYear);

const createAppointment = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }
    const newAppointment = await Appointment.create({
      userId,
      date: req.body.date,
      name: req.body.name,
      phone_1: req.body.phone_1,
      phone_2: req.body.phone_2,
      address: req.body.address,
      comment: req.body.comment,
      commercial: req.body.commercial,
    });
    res.status(201).send({ newAppointment });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Failed to create appointment", error: error.message });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).exec();

    if (!appointment) {
      res.status(404).send({ message: "Appointment not found" });
    } else {
      res.status(200).send({ appointment });
    }
  } catch (error) {
    res.status(400).send({
      message: "Error retrieving appointment by ID",
      error: error.message,
    });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const updateAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        date: req.body.date,
        name: req.body.name,
        phone_1: req.body.phone_1,
        phone_2: req.body.phone_2,
        address: req.body.address,
        commercial: req.body.commercial,
        comment: req.body.comment,
        status: req.body.status,
      },
      { new: true }
    );

    if (!updateAppointment) {
      res.status(404).send({ message: "Appointment not found" });
    } else {
      res.status(200).send({ updateAppointment });
    }
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error updating appointment", error: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      res.status(404).send({ message: "Appointment not found" });
    } else {
      res.status(200).send({ message: "Appointment deleted successfully" });
    }
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error deleting appointment", error: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const { startDate, endDate, page, limit } = req.query;
    const filter = {};
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      populate: { path: "userId", select: "firstName" },
    };
    const appointments = await Appointment.paginate(filter, options);

    res.status(200).send({ appointments });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving appointments", error: error.message });
  }
};

const getAppointmentsByUserId = async (req, res) => {
  try {
    const { date, page, limit } = req.query;
    const { userId } = req.params;

    const filter = { userId };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.createdAt = { $gte: startDate, $lt: endDate };
    }

    // if (startDate && endDate) {
    //   filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    // }
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    };
    const appointments = await Appointment.paginate(filter, options);
    res.status(200).send({ appointments });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving appointments", error: error.message });
  }
};

const getAllAppointmentsByWeek = async (req, res) => {
  try {
    const { week } = req.query;

    // Extraire la valeur de l'année et de la semaine à partir du paramètre de requête
    const [year, weekNumber] = week.split("-W");

    // Convertir les valeurs en nombres entiers
    const yearNumber = parseInt(year);
    const weekNumberInt = parseInt(weekNumber);

    // Utiliser les valeurs pour déterminer la date de début et de fin de la semaine
    const startDate = dayjs()
      .year(yearNumber)
      .week(weekNumberInt)
      .startOf("week");
    const endDate = dayjs().year(yearNumber).week(weekNumberInt).endOf("week");

    const filter = {
      createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    };
    const appointments = await Appointment.find(filter).populate(
      "userId",
      "firstName"
    );

    // Créer un objet pour stocker les résultats
    const userAppointmentsByWeek = [];

    // Parcourir les rendez-vous
    appointments.forEach((appointment) => {
      const { userId, createdAt } = appointment;

      // Obtenir le jour de la semaine (0-6) à partir de la date de création
      const dayOfWeek = new Date(createdAt).getDay();

      // Rechercher l'utilisateur dans le tableau de résultats
      const user = userAppointmentsByWeek.find(
        (item) => item.name === userId.firstName
      );

      if (user) {
        // L'utilisateur existe déjà, mettre à jour le compteur du jour correspondant
        user.week[dayOfWeek]++;
      } else {
        // L'utilisateur n'existe pas encore, ajouter une nouvelle entrée dans le tableau de résultats
        const newUser = {
          name: userId.firstName,
          week: Array(7).fill(0), // Créer un tableau de 7 éléments initialisés à zéro
        };
        // Incrémenter le compteur du jour correspondant
        newUser.week[dayOfWeek]++;

        // Ajouter le nouvel utilisateur au tableau de résultats
        userAppointmentsByWeek.push(newUser);
      }
    });

    res.status(200).send({ employees: userAppointmentsByWeek });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving appointments", error: error.message });
  }
};

export default {
  createAppointment,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAllAppointments,
  getAppointmentsByUserId,
  getAllAppointmentsByWeek,
};
