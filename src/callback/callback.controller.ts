import { Body, Controller, Get, Inject, Logger, Param, Post, Query } from '@nestjs/common'
import { CallbackVerifyData, MessageQueryData } from './shcema/verify.interface'
import { CallbackService } from './callback.service'

@Controller('/callback')
export class CallbackController {
  
  @Inject()
  private readonly callbackService: CallbackService

  private readonly logger = new Logger(CallbackController.name)

  @Get('/:corpId')
  async onVerifyCallback(@Param('corpId') corpId: string, @Query() query: CallbackVerifyData) {
    this.logger.log(`onVerifyCallback(${corpId}, ${JSON.stringify(query)})`)

    const result = await this.callbackService.handleVerifyCallback(corpId, query)

    return result
  }

  @Post('/:corpId')
  async onMessageCallback(@Param('corpId') corpId: string, @Query() query: MessageQueryData, @Body() body: string) {
    this.logger.log(`onMessageCallback(${corpId}, ${JSON.stringify(query)}, ${body})`)

    await this.callbackService.handleMessageCallback(corpId, query, body)

    return
  }
}