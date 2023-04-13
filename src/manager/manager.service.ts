import { Inject, Injectable, Logger } from '@nestjs/common'
import { DeregisterBotRequest, GetAccessTokenRequest, GetAccessTokenResponse, RegisterBotRequest } from './manager.interface'
import axios from 'axios'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ManagerService {

  @Inject()
  private readonly configService: ConfigService

  private readonly logger = new Logger(ManagerService.name)

  async registerBot(botInfo: RegisterBotRequest) {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        this.logger.log(botInfo)
        console.log(botInfo)
        resolve()
      }, 1000)
    })
  }

  async deregisterBot(botInfo: DeregisterBotRequest) {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        this.logger.log(botInfo)
        console.log(botInfo)
        resolve()
      }, 1000)
    })
  }

  async getToken(request: GetAccessTokenRequest): Promise<GetAccessTokenResponse> {
    const accessTokenUrl = this.configService.get<string>('accessTokenUrl') 

    try {
      const response = await axios.get(accessTokenUrl, {
        params: {
          corp_id: request.corpid, // cope with our internal service...
          corpsecret: request.corpsecret,
          corpid: request.corpid,
        }
      })

      return {
        errcode: 0,
        errmsg: '',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        access_token: response.data.accessToken,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expires_in: Math.floor((response.data.expiresAt - Date.now()) / 1000),
      }
    } catch (e) {
      this.logger.error(`get access token failed for ${(e as Error).message}`)
      return {
        errcode: 504,
        errmsg: (e as Error).message,
      }
    }
  }
}