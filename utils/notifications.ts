import admin from "firebase-admin";

let serviceAccount: any;

// Running on Render (production)
if (process.env.NODE_ENV === "production") {
  if (!process.env.SERVICE_ACCOUNT_KEY) {
    throw new Error("SERVICE_ACCOUNT_KEY is missing from environment variables.");
  }

  serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
} else {
  // Local development (using file)
  serviceAccount = require("./google-services.json");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

interface INotiInput {
  topic: "Client" | "Admin";
  title: string;
  body: string;
}

const sendNotification = async ({ topic, title, body }: INotiInput) => {
  const condition = `'${topic}' in topics`;

  const message = {
    notification: { title, body },
    condition,
  };

  try {
    if (process.env.NODE_ENV === "production") {
      const res = await admin.messaging().send(message as any);
      console.log("Notification sent:", res);
    } else {
      console.log(`Notification muted in ${process.env.NODE_ENV}`);
    }
  } catch (e: any) {
    console.error("Error sending notification:", e.message);
  }
};

export default sendNotification;
