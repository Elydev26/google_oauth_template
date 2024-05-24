export class Client {
  type: string;
  name: string;
  version: string;
  url: string;
}

export class DeviceInfoDto {
  client: Client;
  os?: any;
  device?: any;
  bot?: any;
}
