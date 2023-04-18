import { Body, Controller, Get, Inject, Logger, Param, Post, Query } from '@nestjs/common'
import { DeregisterWxkfPuppetRequest, DeregisterWxkfPuppetResponse, GetAccessTokenRequest, GetAccessTokenResponse, RegisterWxkfPuppetRequest, RegisterWxkfPuppetResponse } from './manager.interface'
import { ManagerService } from './manager.service'

@Controller('/puppetWxkfManager')
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

  @Get('/puppetWxkfInfo/:kfId')
  async handlePuppetWxkfInfo(@Param('kfId') kfId: string) {
    const puppetWxkfInfo = await this.managerService.getPuppetWxkfInfoByKfId(kfId)
    
    return puppetWxkfInfo
  }
}