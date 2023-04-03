import { Controller, Get, Logger, Param, Query, Res } from "@nestjs/common";
import { CallbackVerifyData } from "./shcema/verify.interface";
import * as crypto from '@wecom/crypto'
import { Response } from 'express';

@Controller('/callback')
export class CallbackController {
  
  private readonly logger = new Logger(CallbackController.name)

  @Get('/:corpId')
  async onVerifyCallback(@Param('corpId') corpId: string, @Query() query: CallbackVerifyData, @Res() res: Response) {
    this.logger.log(`onVerifyCallback(${corpId}, ${JSON.stringify(query)})`)

    const { msg_signature, timestamp, nonce, echostr } = query;
    const token = 'QimIrBpv'
    const encodingAESKey = 'jrr6JdErP4IQ5ktDzk2AUJdUx9ijc13jb5QfSMKQOrD'
    // TODO: get token and aeskey from db

    const signature = crypto.getSignature(token, timestamp, nonce, echostr)

    if (signature !== msg_signature) {
      this.logger.warn('message signature not match, will dismiss')
      res.status(500)
      res.send('signature not match')
      return
    }
    
    const { message } = crypto.decrypt(encodingAESKey, echostr)
    res.send(message)
    return
  }
}