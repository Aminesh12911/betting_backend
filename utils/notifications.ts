import { initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

process.env.GOOGLE_APPLICATION_CREDENTIALS = `${__dirname}/google-services.json`;
const app = initializeApp();

interface INotiInput {
  topic: 'Client' | 'Admin';
  title: string;
  body: string;
}
const sendNotification = async (args: INotiInput) => {
  const { topic, title, body } = args;
  const condition = `'${topic}' in topics`;
  const message = {
    notification: {
      title,
      body,
    },
    condition,
  };
  if (process.env.NODE_ENV === 'production') {
    try {
      getMessaging(app).send(message);
    } catch (e: any) {
      console.log('Error sending notification');
      console.log(e.message);
    }
  } else console.log(`On ${process.env.NODE_ENV} notification muted.`);
};

export default sendNotification;
