import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { WxkfPuppet, WxkfPuppetDto } from './schema/wxkf-puppet.schema'
import { Model } from 'mongoose'

@Injectable()
export class StateService {
  
  constructor(@InjectModel(WxkfPuppet.name) private wxkfPuppetModel: Model<WxkfPuppet>) {}

  async registerWxkfPuppet(wxkfPuppetDto: WxkfPuppetDto) {
    const existingDoc = await this.wxkfPuppetModel.findOne({
      kfOpenId: wxkfPuppetDto.kfOpenId
    })
    if (existingDoc) {
      return this.wxkfPuppetModel.updateOne({
        _id: existingDoc._id,
      }, {
        ...wxkfPuppetDto,
        online: true,
      })
    }
    const createdWxkfPuppet = new this.wxkfPuppetModel(wxkfPuppetDto)
    return createdWxkfPuppet.save()
  }

  async deregisterWxkfPuppet(wxkfPuppetDto: Partial<WxkfPuppetDto>) {
    if (!wxkfPuppetDto.kfOpenId) {
      throw new Error(`cannot update data without kfId`)
    }
    return this.wxkfPuppetModel.updateOne({
      kfOpenId: wxkfPuppetDto.kfOpenId
    }, {
      ...wxkfPuppetDto,
      online: false,
      lastOnlineDate: new Date(),
    })
  }

  async findPuppetByKfid(kfId: string, corpId?: string) {
    return this.wxkfPuppetModel.find({
      kfOpenId: kfId,
      corpId,
    })
  }
}