import { Body, Controller, Get, Inject, Logger, Param, Post, Query, Req, Res } from '@nestjs/common'
import { DeregisterWxkfPuppetRequest, DeregisterWxkfPuppetResponse, GetAccessTokenRequest, GetAccessTokenResponse, RegisterWxkfPuppetRequest, RegisterWxkfPuppetResponse } from './manager.interface'
import { ManagerService } from './manager.service'
import { Request, Response } from 'express'

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

  @Post('/wxkfRequestProxy/*')
  @Get('/wxkfRequestProxy/*')
  async handleWxkfRequestProxy(@Req() request: Request, @Res() response: Response) {
    const path = request.params[0]
    const query = request.query
    const body = request.body
    const method = request.method
    this.logger.log(`handleWxkfRequestProxy(${method}, ${path}, ${JSON.stringify(query)}), ${JSON.stringify(body)}`)

    const result = await this.managerService.handleWxkfRequestProxy(method, path, query, body)

    response.status(result.status).header(result.headers).send(result.data)
  }
}