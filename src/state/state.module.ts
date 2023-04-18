import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { WxkfPuppet, WxkfPuppetSchema } from './schema/wxkf-puppet.schema'
import { StateService } from './state.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WxkfPuppet.name, schema: WxkfPuppetSchema }])
  ],
  providers: [
    StateService,
  ],
  exports: [
    StateService,
  ]
})
export class StateModule{
}