import mongoose, {model, models} from "mongoose";


const ConversationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
})

const Conversation = models?.Conversation || model("Conversation", ConversationSchema);

export default Conversation;
