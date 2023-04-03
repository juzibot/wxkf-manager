import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { WxkfBot, WxkfBotSchema } from './schema/wxkf-bot.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WxkfBot.name, schema: WxkfBotSchema }])
  ]
})
export class StateModule{

}