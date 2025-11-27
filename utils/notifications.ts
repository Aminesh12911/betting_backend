import admin from "firebase-admin";

let serviceAccount: any = undefined;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount!),
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

  if (process.env.NODE_ENV === "production") {
    try {
      const res = await admin.messaging().send(message as any);
      console.log("Notification sent:", res);
    } catch (e: any) {
      console.error("Error sending notification:", e.message);
    }
  } else {
    console.log(`Notification muted in ${process.env.NODE_ENV}`);
  }
};

export default sendNotification;
