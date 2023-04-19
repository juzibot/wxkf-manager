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
    const createdWxkfPuppet = new this.wxkfPuppetModel({
      ...wxkfPuppetDto,
      online: true,
    })
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

  async findPuppetByKfId(kfId: string) {
    return this.wxkfPuppetModel.findOne({
      kfOpenId: kfId,
    })
  }

  async findPuppetByCorpId(corpId: string) {
    return this.wxkfPuppetModel.find({
      corpId,
      online: true,
    }).sort({
      lastOnlineDate: -1
    }).limit(1)
  }
}