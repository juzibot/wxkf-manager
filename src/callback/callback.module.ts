import { Module } from '@nestjs/common'
import { CallbackController } from './callback.controller'

@Module({
  controllers: [
    CallbackController
  ]
})
export class CallbackModule {}