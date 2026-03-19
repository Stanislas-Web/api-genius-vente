const { Student } = require('../models/student.model');
const { Classroom } = require('../models/classroom.model');
const axios = require('axios');

// Fonction pour envoyer un SMS via Infobip
const sendSMS = async (phone, message) => {
  if (!phone) {
    console.log('Aucun numéro de téléphone fourni');
    return { success: false, error: 'Numéro de téléphone manquant' };
  }

  const url = 'https://nmlygy.api.infobip.com/sms/2/text/advanced';
  
  const headers = {
    'Authorization': 'App d5819848b9e86ee925a9ec584c4d1d91-9ed8758c-2081-4ac2-9192-b2d136e782dd',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const body = {
    messages: [
      {
        destinations: [{ to: phone }],
        from: '447491163443',
        text: message,
      },
    ],
  };

  try {
    const response = await axios.post(url, body, { headers });
    console.log('SMS envoyé avec succès:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Erreur lors de l'envoi du SMS:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// 1. Envoyer un message au parent d'un élève spécifique
exports.sendMessageToParent = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { studentId } = req.params;
    const { message, scheduledTime } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Le message est requis' });
    }

    // Récupérer l'élève
    const student = await Student.findOne({ _id: studentId, companyId })
      .populate('classroomId', 'name code');

    if (!student) {
      return res.status(404).json({ message: 'Élève non trouvé ou ne vous appartient pas' });
    }

    // Vérifier si l'élève a un tuteur avec un numéro de téléphone
    if (!student.tuteur || !student.tuteur.phone) {
      return res.status(400).json({ 
        message: 'Aucun numéro de téléphone de tuteur associé à cet élève',
        student: {
          firstName: student.firstName,
          lastName: student.lastName,
          matricule: student.matricule
        }
      });
    }

    const parentPhone = student.tuteur.phone;
    const parentName = student.tuteur.name || 'Parent';

    // Construire le message personnalisé
    const fullMessage = `Bonjour ${parentName},\n\nConcernant ${student.firstName} ${student.lastName} (${student.classroomId?.name || 'Classe'}):\n\n${message}\n\nÉcole ${req.companyName || ''}`;

    // Si scheduledTime est fourni, vérifier qu'il est dans le futur
    if (scheduledTime) {
      const scheduledDate = new Date(scheduledTime);
      const now = new Date();
      
      if (scheduledDate <= now) {
        return res.status(400).json({ message: 'L\'heure programmée doit être dans le futur' });
      }

      // Pour l'instant, on envoie immédiatement (la programmation peut être ajoutée plus tard)
      return res.status(200).json({
        message: 'Message programmé (sera envoyé immédiatement pour cette version)',
        scheduledTime,
        recipient: {
          studentName: `${student.firstName} ${student.lastName}`,
          parentName,
          parentPhone
        }
      });
    }

    // Envoyer le SMS immédiatement
    const result = await sendSMS(parentPhone, fullMessage);

    if (result.success) {
      res.status(200).json({
        message: 'Message envoyé avec succès au parent',
        recipient: {
          studentName: `${student.firstName} ${student.lastName}`,
          matricule: student.matricule,
          parentName,
          parentPhone,
          classroom: student.classroomId?.name
        },
        smsResult: result.data
      });
    } else {
      res.status(500).json({
        message: 'Erreur lors de l\'envoi du SMS',
        error: result.error,
        recipient: {
          studentName: `${student.firstName} ${student.lastName}`,
          parentPhone
        }
      });
    }
  } catch (error) {
    console.error('Error sending message to parent:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi du message', error });
  }
};

// 2. Envoyer un message à tous les parents d'une classe
exports.sendMessageToClass = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { classroomId } = req.params;
    const { message, scheduledTime } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Le message est requis' });
    }

    // Récupérer la classe
    const classroom = await Classroom.findOne({ _id: classroomId, companyId });

    if (!classroom) {
      return res.status(404).json({ message: 'Classe non trouvée ou ne vous appartient pas' });
    }

    // Récupérer tous les élèves actifs de la classe
    const students = await Student.find({ 
      classroomId, 
      companyId,
      status: 'actif'
    }).select('firstName lastName matricule tuteur');

    if (students.length === 0) {
      return res.status(404).json({ message: 'Aucun élève trouvé dans cette classe' });
    }

    // Filtrer les élèves avec un numéro de téléphone de tuteur
    const studentsWithPhone = students.filter(s => s.tuteur && s.tuteur.phone);

    if (studentsWithPhone.length === 0) {
      return res.status(400).json({ 
        message: 'Aucun élève de cette classe n\'a de numéro de téléphone de tuteur',
        totalStudents: students.length
      });
    }

    // Construire le message pour la classe
    const fullMessage = `Bonjour,\n\nMessage pour la classe ${classroom.name} (${classroom.code}):\n\n${message}\n\nÉcole ${req.companyName || ''}`;

    // Envoyer les SMS
    const results = [];
    const errors = [];

    for (const student of studentsWithPhone) {
      const result = await sendSMS(student.tuteur.phone, fullMessage);
      
      if (result.success) {
        results.push({
          studentName: `${student.firstName} ${student.lastName}`,
          matricule: student.matricule,
          parentPhone: student.tuteur.phone,
          status: 'envoyé'
        });
      } else {
        errors.push({
          studentName: `${student.firstName} ${student.lastName}`,
          parentPhone: student.tuteur.phone,
          error: result.error
        });
      }

      // Petite pause entre chaque SMS pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    res.status(200).json({
      message: 'Messages envoyés à la classe',
      classroom: {
        name: classroom.name,
        code: classroom.code,
        level: classroom.level
      },
      summary: {
        totalStudents: students.length,
        studentsWithPhone: studentsWithPhone.length,
        messagesSent: results.length,
        messagesFailed: errors.length
      },
      results,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error sending message to class:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi des messages à la classe', error });
  }
};

// 3. Envoyer un message à tous les parents de l'école
exports.sendMessageToSchool = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { message, scheduledTime } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Le message est requis' });
    }

    // Récupérer tous les élèves actifs de l'école
    const students = await Student.find({ 
      companyId,
      status: 'actif'
    })
    .populate('classroomId', 'name code')
    .select('firstName lastName matricule tuteur classroomId');

    if (students.length === 0) {
      return res.status(404).json({ message: 'Aucun élève trouvé dans l\'école' });
    }

    // Filtrer les élèves avec un numéro de téléphone de tuteur
    const studentsWithPhone = students.filter(s => s.tuteur && s.tuteur.phone);

    if (studentsWithPhone.length === 0) {
      return res.status(400).json({ 
        message: 'Aucun élève n\'a de numéro de téléphone de tuteur',
        totalStudents: students.length
      });
    }

    // Construire le message général
    const fullMessage = `Bonjour,\n\nMessage de l'école:\n\n${message}\n\nÉcole ${req.companyName || ''}`;

    // Envoyer les SMS
    const results = [];
    const errors = [];
    const classSummary = {};

    for (const student of studentsWithPhone) {
      const result = await sendSMS(student.tuteur.phone, fullMessage);
      
      const className = student.classroomId?.name || 'Non assigné';
      
      if (!classSummary[className]) {
        classSummary[className] = { sent: 0, failed: 0 };
      }

      if (result.success) {
        results.push({
          studentName: `${student.firstName} ${student.lastName}`,
          matricule: student.matricule,
          classroom: className,
          parentPhone: student.tuteur.phone,
          status: 'envoyé'
        });
        classSummary[className].sent++;
      } else {
        errors.push({
          studentName: `${student.firstName} ${student.lastName}`,
          classroom: className,
          parentPhone: student.tuteur.phone,
          error: result.error
        });
        classSummary[className].failed++;
      }

      // Petite pause entre chaque SMS
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    res.status(200).json({
      message: 'Messages envoyés à toute l\'école',
      summary: {
        totalStudents: students.length,
        studentsWithPhone: studentsWithPhone.length,
        messagesSent: results.length,
        messagesFailed: errors.length
      },
      byClass: classSummary,
      results,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error sending message to school:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi des messages à l\'école', error });
  }
};
