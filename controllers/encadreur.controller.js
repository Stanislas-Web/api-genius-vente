
const { Encadreur } = require("../models/encadreur.model");
const nodemailer = require("nodemailer");
const axios = require('axios');
const path = require('path');



module.exports.callBackPayementCardSucces = async (req, res) => {

const {
  cpm_trans_id,
  cpm_amount,
  cpm_currency,
  amount,
  receiver,
  sending_status,
  comment,
  treatment_status,
  operator_transaction_id,
  validated_at
} = req.body;


const transaction_id = req.params.cpm_trans_id;



const currency = "USD";
const name = "Stanislas Mak";
const email ="stanislasmakengo1@gmail.com"



  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: "stanislasmakengo1@gmail.com",
      pass: "dlot swgk skfa zmui",
    },
  });
  
  const infoUser = await transporter.sendMail({
    from: `"${name}" <Ifuluvissy@gmail.com>`,
    to: `${email}`, 
    subject: "Confirmation de votre paiement réussi", 
    html: `Bonjour ${name},<br/><br/>Nous tenons à vous informer que votre paiement de ${cpm_amount} ${cpm_currency} ${transaction_id} a été effectué avec succès.<br/><br/>Merci pour votre soutien à la Cité Missionnaire Hosanna.<br/><br/>Que Dieu vous bénisse.<br/><br/>Bien Cordialement,`, // html body
  });

  return res.sendFile(path.join(__dirname, '/success.html'));
};


module.exports.checkApi = async (req, res) => {

    return res.send("done");
  };




module.exports.callBackPayementCardError = async (req, res) => {

  const idResto = req.params.idResto;
  const phoneClient = req.params.phoneClient;
  const invoiceNumber = req.params.invoiceNumber;

  const findReporting = await Reporting.findOne({phoneClient: phoneClient, idResto: idResto, status: "pending", invoiceNumber: invoiceNumber});

  const update = {status: "failure"};
  await Reporting.updateOne(findReporting, update);

  return res.sendFile(path.join(__dirname, '/error.html'));


};

module.exports.createEncadreur = async (req, res) => {
  const {
    name,
    cours,
    prix,
    like,
    share,
    biographie,
    image,
  } = req.body;

  const encadreur = new Encadreur({
    name: name,
    cours: cours,
    prix: prix,
    like: like,
    share: share,
    biographie: biographie,
    image: image,
  });

  const result = await encadreur.save();

  return res.status(200).send({
    message: "Save Encadreur",
    data: result,
  });
};


module.exports.sendPaymentEglise = async (req, res) => {
  const {
    name,
    email,
    amount,
    currency,
    phone,
    plateform
  } = req.body;


  const transaction_id = Math.floor(Math.random() * 100000000).toString();



  var data = JSON.stringify({
    "apikey": "963979951667554754f0ea2.30886517",
    "site_id": "5874776",
    "transaction_id": transaction_id,
    "amount": amount,
    "currency": currency,
    "alternative_currency": "",
    "description": "Don pour la Cité Missionnaire Hosanna",
    "customer_id": Math.floor(Math.random() * 100000000).toString(),
    "customer_name": name,
    "customer_surname": name,
    "customer_email": email,
    "customer_phone_number": phone,
    "customer_address": "kinshasa",
    "customer_city": "Kinshasa",
    "customer_country": "CD",
    "customer_state": "CD",
    "customer_zip_code": "065100",
    "notify_url": `https://api-bantou-store.vercel.app/api/v1/callbacksuccess/${transaction_id}`,
    "return_url": "https://webhook.site/d1dbbb89-52c7-49af-a689-b3c412df820d",
    "channels": "ALL",
    "metadata": "user1",
    "lang": "FR",
    "invoice_data": {
      "Donnee1": "",
      "Donnee2": "",
      "Donnee3": ""
    }
  });

  var config = {
    method: 'post',
    url: 'https://api-checkout.cinetpay.com/v2/payment',
    headers: { 
      'Content-Type': 'application/json'
    },
    data: data
  };

  try {
    const response = await axios(config);
    console.log(JSON.stringify(response.data));
  
    return res.status(200).send({
      message: "Send Payment",
      data: response.data.data,
    });

  } catch (error) {
    console.error(error);
  }





};


module.exports.sendMailEglise = async (req, res) => {
  const {
    name,
    email,
    phone,
    nationalite
  } = req.body;


  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: "stanislasmakengo1@gmail.com",
      pass: "dlot swgk skfa zmui",
    },
  });

  const info = await transporter.sendMail({
    from: `"${name}" <stanislasmakengo1@gmail.com>`, 
    to: "Ifuluvissy@gmail.com", 
    subject: "Soumission du Formulaire de la Cité Missionnaire Hosanna", 
    html: `Bonjour,<br/><br/>Je tiens à vous signaler qu'un formulaire a été soumis  pour la Cité Missionnaire Hosanna.<br/><br/>Voici Les informations du formulaire: <br/><br/>Nom complet: <b>${name}</b><br/>Tél: <b>${phone}</b><br/>Email: <b>${email}</b><br/>Nationalité: <b>${nationalite}</b><br/><br/><br/>Cordialement,`, // html body
  });

  const infoUser = await transporter.sendMail({
    from: `"${name}" <Ifuluvissy@gmail.com>`,
    to: `${email}`, 
    subject: "Confirmation de Soumission du Formulaire de la Cité Missionnaire Hosanna", 
    html: `Bonjour ${name},<br/><br/>Nous vous remercions d'avoir soumis le formulaire de la Cité Missionnaire Hosanna.<br/><br/>Cordialement,`, // html body
  });

  const infoDev = await transporter.sendMail({
    from: `"${name}" <stanislasmakengo1@gmail.com>`, 
    to: "stanislasmakengo1@gmail.com", 
    subject: "Soumission du Formulaire de la Cité Missionnaire Hosanna", 
    html: `Bonjour,<br/><br/>Je tiens à vous signaler qu'un formulaire a été soumis  pour la Cité Missionnaire Hosanna.<br/><br/>Voici Les informations du formulaire: <br/><br/>Nom complet: <b>${name}</b><br/>Tél: <b>${phone}</b><br/>Email: <b>${email}</b><br/>Nationalité: <b>${nationalite}</b><br/><br/><br/>Cordialement,`, // html body
  });

  

  return res.status(200).send({
    message: "Send Email",
    data: infoUser,
  });
};


module.exports.sendMailEncadreur = async (req, res) => {
  const {
    name,
    cours,
    email,
    phone,
  } = req.body;


  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: "stanislasmakengo1@gmail.com",
      pass: "dlot swgk skfa zmui",
    },
  });


  const info = await transporter.sendMail({
    from: `"${name}" <stanislasmakengo1@gmail.com>`, 
    to: "winniekatnyota@gmail.com", 
    subject: "Candidature pour le poste de professeur sur la plateforme Akilimali", 
    html: `Bonjour, je m'appelle <b>${name}</b>, Je souhaite soumettre ma candidature pour devenir professeur sur votre plateforme Akilimali. <br/> Avec plusieurs années d'expérience dans l'enseignement et une passion pour partager mes connaissances,<br/>  je suis convaincu de pouvoir contribuer positivement à votre équipe éducative.<br/>  Je suis disponible pour discuter de cette opportunité et de la manière dont je pourrais aider vos étudiants à atteindre leurs objectifs académiques.<br/>  Merci pour votre considération.<br/><br/>Voici mes coordonnées <br/><br/>Tel: <b>${phone}</b><br/>Email: <b>${email}</b><br/>Cours: <b>${cours}</b><br/>    <br/><br/>Cordialement,`, // html body
  });

  const infoUser = await transporter.sendMail({
    from: `"${name}" <stanislasmakengo1@gmail.com>`,
    to: `${email}`, 
    subject: "Candidature pour le poste de professeur sur la plateforme Akilimali", 
    html: `Bonjour ${name},<br/><br/>Merci pour l’intérêt que vous portez à Akilimali !<br/>C'est toujours un plaisir de recevoir des candidatures de passionné·es.<br/><br/>Nous confirmons avoir bien reçu la votre pour le cours de <b>${cours}</b><br/><br/>Nous allons prendre le temps de l'étudier et nous nous engageons à vous faire un retour dans les meilleurs délais.<br/>Parfois c'est 2 jours et parfois plutôt  semaines ...<br/><br/>Merci pour votre compréhension.`, // html body
  });


  return res.status(200).send({
    message: "Send Email",
    data: info,
  });
};

module.exports.getAllEncadreur = async (req, res) => {
  const result = await Encadreur.find();

  return res.status(200).send({
    message: "get all encadreurs",
    data: result,
  });
};
