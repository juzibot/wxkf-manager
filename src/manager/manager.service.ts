import { Inject, Injectable, Logger } from '@nestjs/common'
import { DeregisterWxkfPuppetRequest, GetAccessTokenRequest, GetAccessTokenResponse, RegisterWxkfPuppetRequest } from './manager.interface'
import axios from 'axios'
import { ConfigService } from '@nestjs/config'
import { StateService } from 'src/state/state.service'

@Injectable()
export class ManagerService {

  @Inject()
  private readonly stateService: StateService

  @Inject()
  private readonly configService: ConfigService

  private readonly logger = new Logger(ManagerService.name)

  async registerWxkfPuppet(wxkfPuppetInfo: RegisterWxkfPuppetRequest) {
    await this.stateService.registerWxkfPuppet({
      botEndpoint: wxkfPuppetInfo.endpoint,
      kfOpenId: wxkfPuppetInfo.kfId,
      name: wxkfPuppetInfo.kfName,
      corpId: wxkfPuppetInfo.corpId,
      corpSecret: wxkfPuppetInfo.corpSecret,
      token: wxkfPuppetInfo.token,
      encodingAESKey: wxkfPuppetInfo.encodingAESKey,
    })
    this.logger.log(`wxkf ${wxkfPuppetInfo.kfId} registered successfully, endpoint: ${wxkfPuppetInfo.endpoint}`)
  }

  async deregisterWxkfPuppet(wxkfPuppetInfo: DeregisterWxkfPuppetRequest) {
    await this.stateService.deregisterWxkfPuppet({
      kfOpenId: wxkfPuppetInfo.kfId,
      corpId: wxkfPuppetInfo.corpId,
    })
    this.logger.log(`wxkf ${wxkfPuppetInfo.kfId} deregistered successfully`)
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