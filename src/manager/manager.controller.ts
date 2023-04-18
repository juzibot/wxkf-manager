import { Body, Controller, Get, Inject, Logger, Post, Query } from '@nestjs/common'
import { DeregisterWxkfPuppetRequest, DeregisterWxkfPuppetResponse, GetAccessTokenRequest, GetAccessTokenResponse, RegisterWxkfPuppetRequest, RegisterWxkfPuppetResponse } from './manager.interface'
import { ManagerService } from './manager.service'

@Controller('/botManager')
export class ManagerController {
  
  @Inject()
  private readonly managerService: ManagerService

  private readonly logger = new Logger(ManagerController.name)

  @Post('/register')
  async handleWxkfPuppetRegister(@Body() body: RegisterWxkfPuppetRequest): Promise<RegisterWxkfPuppetResponse> {
    this.logger.log(`handleBotRegister(${JSON.stringify(body)})`)

    try {
      await this.managerService.registerWxkfPuppet(body)
    } catch (e) {
      return {
        code: 503,
        message: (e as Error).message,
      }
    }
    return {
      code: 0,
      message: 'success',
    }

    // TODO: to be implemented
  }

  @Post('/deregister')
  async handleWxkfPuppetDeregister(@Body() body: DeregisterWxkfPuppetRequest): Promise<DeregisterWxkfPuppetResponse> {
    this.logger.log(`handleBotDeregister(${JSON.stringify(body)})`)

    try {
      await this.managerService.deregisterWxkfPuppet(body)
    } catch (e) {
      return {
        code: 503,
        message: (e as Error).message,
      }
    }
    return {
      code: 0,
      message: 'success',
    }

    // TODO: to be implemented
  }

  @Get('/getToken')
  async handleGetToken(@Query() query: GetAccessTokenRequest): Promise<GetAccessTokenResponse> {
    this.logger.log(`handleGetToken(${JSON.stringify(query)})`)

    try {
      return await this.managerService.getToken(query)
    } catch (e) {
      return {
        errcode: 503,
        errmsg: (e as Error).message,
      }
    }
  }
}