import { Router } from "express"; 
import { showApiUsers, showApiUserId, addApiUser, updateApiUser, deleteApiUser } from '../controllers/apiUser.controller.js'; 

const router = Router();
const apiName = '/apiUser';

router.route(apiName)
  .get(showApiUsers)
  .post(addApiUser);

router.route(`${apiName}/:id`)
  .get(showApiUserId)
  .put(updateApiUser)
  .delete(deleteApiUser);

export default router;