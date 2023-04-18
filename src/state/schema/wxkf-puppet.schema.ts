import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type WxkfPuppetDocument = HydratedDocument<WxkfPuppet>

@Schema()
export class WxkfPuppet {

  @Prop({ required: true })
  botEndpoint: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true, unique: true })
  kfOpenId: string

  @Prop({ required: true })
  corpId: string

  @Prop({ required: true })
  corpSecret: string

  @Prop({ required: true })
  token: string

  @Prop({ required: true })
  encodingAESKey: string 

  @Prop({ required: true })
  online: boolean

  @Prop()
  lastOnlineDate: Date
}

export interface WxkfPuppetDto {
  botEndpoint: string
  kfOpenId: string
  name: string
  corpId: string
  corpSecret: string
  token: string
  encodingAESKey: string
}

export const WxkfPuppetSchema = SchemaFactory.createForClass(WxkfPuppet)
