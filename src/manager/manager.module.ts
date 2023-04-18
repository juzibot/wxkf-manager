import { Module } from '@nestjs/common'
import { ManagerController } from './manager.controller'
import { ManagerService } from './manager.service'
import { StateModule } from 'src/state/state.module'

@Module({
  imports: [StateModule],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}