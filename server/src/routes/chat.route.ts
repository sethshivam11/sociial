import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { addParticipants, createGroupChat, createOneToOneChat, deleteGroup, getChats, leaveGroup, makeAdmin, removeAdmin, removeGroupIcon, removeParticipants, updateGroupDetails } from "../controllers/chat.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router()

router.use(verifyJWT)

router.route("/new/:receiverId").post(createOneToOneChat)

router.route("/get").get(getChats)

router.route("/newGroup").post(
    upload.single("groupImage"),
    createGroupChat)

router.route("/addParticipants").patch(addParticipants)

router.route("/removeParticipants").patch(removeParticipants)

router.route("/updateGroup").put(
    upload.single("groupImage"),
    updateGroupDetails)

router.route("/removeGroupImage/:chatId").patch(removeGroupIcon)

router.route("/leaveGroup/:chatId").get(leaveGroup)

router.route("/deleteGroup/:chatId").delete(deleteGroup)

router.route("/makeAdmin").patch(makeAdmin)

router.route("/removeAdmin").patch(removeAdmin)

export default router