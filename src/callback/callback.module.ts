import { Module } from '@nestjs/common'
import { CallbackController } from './callback.controller'
import { CallbackService } from './callback.service'
import { StateModule } from '../state/state.module'

@Module({
  imports: [
    StateModule,
  ],
  providers: [
    CallbackService,
  ],
  controllers: [
    CallbackController,
  ]
})
export class CallbackModule {}