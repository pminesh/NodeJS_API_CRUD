'use strict'
import { Client } from '@elastic/elasticsearch';
import { empDB } from '../model/employee_model.js';

import nodemailer from "nodemailer";
import dotenv from "dotenv";


dotenv.config({ path: 'config.env' });

const esClient = new Client({ node: 'http://localhost:9200' })

// ===============================================================get
export const getEmployee = (req, res) => {
    if (req.query.id) {
        const id = req.query.id;

        empDB.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found user with id " + id })
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Erro retrieving user with id " + id })
            })

    } else {
        empDB.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Error Occurred while retriving user information" })
            })
    }
}

// ===============================================================insert
export const addEmployee = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }
    // var files_names = [];
    // for (var i = 0; i < req.files.length; i++) {
    //     files_names.push(req.files[i].originalname);
    // }

    // ===============
    // esClient.index({
    //     index: 'employee_dbs',
    //     body: {
    //         name: req.body.name,
    //         email: req.body.email,
    //         gender: req.body.gender,
    //         status: req.body.status,
    //         image: files_names,//single file upload:  req.file.originalname
    //     }
    // }).then(response => {
    //     return res.json({ "message": "Indexing successful" })
    // })
    //     .catch(err => {
    //         console.log(err);
    //         return res.status(500).json({ "message": err })
    //     })
    // ===============

    // new user
    const user = new empDB({
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        status: req.body.status,
        image: req.files,//single file upload:  req.file.originalname
    });

    if (req.file) {
        empDB.profile = req.file.path;
    }
    // save user in the database
    user
        .save(user)
        .then(data => {
            res.status(200).send("Employee added successfuly.");
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a create operation"
            });
        });
}

// ===============================================================update
export const updateEmployee = (req, res) => {
    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" })
    }
    console.log(req.body)
    const { name, email, gender, status } = req.body;
    const image = req.files;
    const id = req.params.id;

    empDB.findByIdAndUpdate(id, { name, email, gender, status, image }, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` })
            } else {
                res.status(200).send("Employee updated successfuly.");
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({ message: "Error Update user information" })
        })
}

// ===============================================================delete
export const deleteEmployee = (req, res) => {
    const id = req.params.id;

    empDB.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` })
            } else {
                res.send({
                    message: "User was deleted successfully!"
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
}

// ===============================================================mail send--content-type:json
// {
//     "to":"minesh@broadviewinnovations.in",
//     "subject":"Test Demo",
//     "text":"Hii",
//     "html":"<h1>Minesh</h1>"
// }
export const sendMail = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USERNAME, // generated ethereal user
            pass: process.env.MAIL_PASSWORD, // generated ethereal password
        },
    });

    console.log(req.body.to, req.body.subject, req.body.text, req.body.html);

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: process.env.MAIL_USERNAME, // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line
        text: req.body.text, // plain text body
        html: req.body.html, // html body
    }).then(data => {
        res.status(200).send("Email sent successfuly.");
    })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a create operation"
            });
        });
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};
