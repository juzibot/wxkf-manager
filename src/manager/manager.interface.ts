
export interface RegisterWxkfPuppetRequest {
  kfId: string,
  kfName: string,
  endpoint: string,
  corpId: string,
  corpSecret: string,
  token: string,
  encodingAESKey: string,
}

export interface ManagerCenterResponseBase {
  code: number,
  message: string,
}

export interface RegisterWxkfPuppetResponse extends ManagerCenterResponseBase {}

export interface DeregisterWxkfPuppetRequest {
  kfId: string,
  corpId: string,
}

export interface DeregisterWxkfPuppetResponse extends ManagerCenterResponseBase {}

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