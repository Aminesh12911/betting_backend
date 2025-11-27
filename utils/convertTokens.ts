class convertToken {
  data: string;

  constructor(data: string) {
    this.data = data;
  }

  toUtf8() {
    const buff = Buffer.from(this.data, 'base64');
    return buff.toString('utf-8').split(':');
  }

  toBase64() {
    const buff = Buffer.from(this.data, 'utf-8');
    return buff.toString('base64');
  }
}

export default convertToken;
