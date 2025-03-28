import { Webhook } from "svix";
import connectDB from "../../../config/db";
import User from "../../../models/user";

export async function POST(req) {
    const wh = new Webhook(process.env.SIGNING_SECRET)
    const headerPayload = await Headers()
    const svixHeaders = {
        "svix-id": headerPayload.get("svix-id"),
        "svix-timestamp": headerPayload.get("svix-timestamp"),
        "svix-signature": headerPayload.get("svix-signature"),
    };

    // get the payload and verify it
    const payload = await req.json();
    const body = JSON.stringify(payload);
    const {data, type} = wh.verify(body, svixHeaders)

    // Prepare the user data to save in the data base
    const userData = {
        _id : data.id,
        email : data.email_addresses[0].email_addresses,
        name : `${data.first_name} ${data.last_name}`,
        image : data.image_url,
    };

    await connectDB();

    switch (type) {
        case 'user.created':
            await User.create(userData)
            break;

            case 'user.updated':
                await User.findByIdAndUpdate(data.id, userData)
                break;

                case 'user.deleted':
                    await User.findByIdAndDelete(data.id)
                    break;
    
        default:
            break;
    }

    return json({message: 'Event Received'});
}