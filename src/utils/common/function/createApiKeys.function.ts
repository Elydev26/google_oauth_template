export async function generateAPIKeys() {
  const values =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let devKey = randomString(16, values);
  let prodKey = randomString(16, values);

  devKey = `YUKI_DEV_${devKey}`;
  prodKey = `YUKI_LIVE_${prodKey}`;

  return {
    devKey,
    prodKey,
  };
}

const randomString = (length: number, chars: string) => {
  let result = '';
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};
