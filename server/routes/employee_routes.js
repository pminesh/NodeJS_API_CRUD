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

router.get('/api/employee',getEmployee);
router.post('/api/employee',upload.array('img',12),addEmployee);//single image upload:  upload.single('img')
router.put('/api/employee/:id', upload.array('img',12),updateEmployee);
router.delete('/api/employee/:id', deleteEmployee);
router.post('/api/send_mail',sendMail);

export {router}