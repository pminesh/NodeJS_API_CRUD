import express  from "express";
import multer from "multer";
import {getEmployee,addEmployee,updateEmployee,deleteEmployee,sendMail} from "../controllers/employee_controller.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets/uploads');
    },
    filename: (req, file, cb) => {
        cb(null,file.originalname);//with date:Date.now()+'-'+file.originalname
    }
});

const router = express.Router();
const upload = multer({ storage });
//===============get
/**
 * @swagger
 * /api/employee:
 *  get:
 *   summary: get all employees
 *   description: get all employees
 *   tags: ["CRUD operations"]
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: error
 */
router.get('/api/employee',getEmployee);

//===============add
/**
 * @swagger
 * definitions:
 *  Employee:
 *   type: object
 *   properties:
 *    name:
 *     type: string
 *     description: name of the employee
 *     example: 'demouser'    
 *    email:
 *     type: string
 *     description: email of the employee
 *     example: 'demo@gmail.com'
 *    gender:
 *     type: string
 *     description: gender of the employee
 *     example: 'male'
 *    status:
 *     type: string
 *     description: biography of the employee
 *     example: 'active'
 *    img:
 *     type: file
 *     description: designation of the employee
 *  Email:
 *   type: object
 *   properties:
 *    to:
 *     type: string
 *     description: to email id
 *     example: 'demo@gmail.com'
 *    subject:
 *     type: string
 *     description: subject
 *     example: 'Test Demo'
 *    text:
 *     type: string
 *     description: text
 *     example: 'hello user'
 *    html:
 *     type: string
 *     description: html
 *     example: '<h2>User</h2>'
 */

 /**
  * @swagger
  * /api/employee:
  *  post:
  *   summary: create employee
  *   description: create employee for the organisation
  *   tags: ["CRUD operations"]
  *   requestBody:
  *    content:
  *     multipart/form-data:
  *      schema:
  *       $ref: '#/definitions/Employee'
  *   responses:
  *    200:
  *     description: employee created succesfully
  *    500:
  *     description: failure in creating employee
  */
router.post('/api/employee',upload.array('img',12),addEmployee);//single image upload:  upload.single('img')

//===============update
/**
 * @swagger
 * /api/employee/{id}:
 *  put:
 *   summary: update employee
 *   description: update employee
 *   tags: ["CRUD operations"]
 *   consumes:
 *    - application/json
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: id of the employee
 *      example: 623ef5b95e2651ec95206e22
 *   requestBody:
 *    content:
 *     multipart/form-data:
 *      schema:
 *       $ref: '#/definitions/Employee'
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: failure in update employee
 */
router.put('/api/employee/:id', upload.array('img',12),updateEmployee);

//===============delete
/**
 * @swagger
 * /api/employee/{employee_id}:
 *  delete:
 *   summary: delete employee
 *   description: delete employee
 *   tags: ["CRUD operations"]
 *   parameters:
 *    - in: path
 *      name: employee_id
 *      schema:
 *       type: string
 *      required: true
 *      description: id of the employee
 *      example: 6242c8a218eaa6e30c89c98a
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description: failure in delete employee
 */
router.delete('/api/employee/:id', deleteEmployee);

//===============send mail
 /**
  * @swagger
  * /api/send_mail:
  *  post:
  *   summary: send mail
  *   description: send mail
  *   requestBody:
  *    content:
  *     application/json:
  *      schema:
  *       $ref: '#/definitions/Email'
  *   responses:
  *    200:
  *     description: mail send succesfully
  *    500:
  *     description: failure in creating employee
  */
router.post('/api/send_mail',sendMail);

export {router}
