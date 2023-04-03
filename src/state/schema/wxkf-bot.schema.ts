import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type WxkfBotDocument = HydratedDocument<WxkfBot>

@Schema()
export class WxkfBot {
  @Prop()
  botId: string

  @Prop()
  botEndpoint: string

  @Prop()
  kfOpenId: string

  @Prop()
  wxkfAuthType: WXKF_AUTH_TYPE

  @Prop()
  wxkfAuthZjyy?: WxkfAuthZjyy

  @Prop()
  wxkfAuthFwsdkf?: WxkfAuthFwsdkf
}

export interface WxkfAuthZjyy {
  token: string, // Token可由企业任意填写，用于生成签名。
  encodingAESKey: string, // EncodingAESKey用于消息体的加密。
  corpId: string, // 企微客服所属企业的id
  corpSecret: string, // 企微客服应用的secret
}

// wip
export interface WxkfAuthFwsdkf {
  providerSecret: string, // 服务商的secret，在服务商管理后台可见
  providerCorpId: string, // 服务商的corpid
}

export enum WXKF_AUTH_TYPE {
  ZJYY = 'ZJYY', // 自建应用
  FWSDKF = 'FWSDKF', // 服务商待开发
}

export const WxkfBotSchema = SchemaFactory.createForClass(WxkfBot)
