
export interface RegisterBotRequest {
  kfId: string,
  kfName: string,
  endpoint: string,
  corpId: string,
  token: string,
  encodingAESKey: string,
}

export interface ManagerCenterResponseBase {
  code: number,
  message: string,
}

export interface RegisterBotResponse extends ManagerCenterResponseBase {}

export interface DeregisterBotRequest {
  kfId: string,
  kfName: string,
  corpId: string,
}

export interface DeregisterBotResponse extends ManagerCenterResponseBase {}

// 为了和企微api一致，命名方法会有些不同

export interface GetAccessTokenRequest {
  corpid: string,
  corpsecret: string,

}

export interface GetAccessTokenResponse {
  access_token?: string,
  expires_in?: number,
  errcode: number, // 返回码
  errmsg: string, // 错误码描述
}