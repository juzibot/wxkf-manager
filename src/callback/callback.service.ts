import { Inject, Injectable, Logger } from '@nestjs/common'
import { StateService } from '../state/state.service'
import * as crypto from '@wecom/crypto'
import { BodyXmlData, CallbackVerifyData, EventXmlData, MessageQueryData } from './shcema/verify.interface'
import xml2js from 'xml2js'
import axios from 'axios'

@Injectable()
export class CallbackService {

  @Inject()
  private readonly stateService: StateService

  private readonly logger = new Logger(CallbackService.name)

  async handleVerifyCallback(corpId: string, data: CallbackVerifyData) {
    const wxkfPuppetInfo = await this.stateService.findPuppetByCorpId(corpId)

    if (!wxkfPuppetInfo) {
      this.logger.warn(`cannot find a online puppet for corp ${corpId}, message dismissed`)
      return ''
    }
    const token = wxkfPuppetInfo[0].token
    const encodingAESKey = wxkfPuppetInfo[0].encodingAESKey

    const { msg_signature, timestamp, nonce, echostr } = data
    const signature = crypto.getSignature(token, timestamp, nonce, echostr)

    if (signature !== msg_signature) {
      this.logger.warn('message signature not match, will dismiss')
      return ''
    }

    const { message } = crypto.decrypt(encodingAESKey, echostr)
    return message
  }

  async handleMessageCallback(corpId: string, data: MessageQueryData, xmlString: string) {
    const corpPuppetInfo = await this.stateService.findPuppetByCorpId(corpId)

    if (!corpPuppetInfo) {
      this.logger.warn(`cannot find a online puppet for corp ${corpId}, message dismissed`)
      return
    }

    const endpoint = corpPuppetInfo[0].botEndpoint
    const token = corpPuppetInfo[0].token
    const encodingAESKey = corpPuppetInfo[0].encodingAESKey

    const { msg_signature, timestamp, nonce } = data

    const bodyObject = await xml2js.parseStringPromise(xmlString) as BodyXmlData
    const encryptedStr = bodyObject.xml.Encrypt[0]

    const signature = crypto.getSignature(token, timestamp, nonce, encryptedStr)
    if (signature !== msg_signature) {
      this.logger.warn('message signature does not match, will dismiss')
      return
    }

    const { message, id, random } = crypto.decrypt(encodingAESKey, encryptedStr)
    void id, random

    const messageObject = await xml2js.parseStringPromise(message) as EventXmlData

    const openKfId = messageObject.xml.OpenKfId[0]
    const targetPuppet = await this.stateService.findPuppetByKfId(openKfId)

    if (!targetPuppet) {
      this.logger.warn(`cannot find online puppet for kfId ${openKfId}`)
      return
    }

    const eventType = messageObject.xml.Event[0]
    if (eventType !== 'kf_msg_or_event') {
      this.logger.warn(`event type [${eventType}] we don't handle, dismiss`)
    }

    this.logger.log(`message event for puppetWxkf ${openKfId}`)

    await axios.post(`${endpoint}/callback`, xmlString, {
      headers: {
        'Content-Type': 'application/xml'
      },
      params: data,
    })
  }
}