import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { LoggerModule } from 'nestjs-pino'
import { multistream } from 'pino'
import configuration from './config/configuration'
import { existsSync, mkdirSync } from 'fs'
import { LogStream } from 'logfilestream'
import pretty from 'pino-pretty'
import { CallbackModule } from './callback/callback.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ManagerModule } from './manager/manager.module'

@Module({
  imports: [
    CallbackModule,
    ManagerModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({
      verboseMemoryLeak: true,
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isDev = config.get('isDev')
        const logPath: string = config.get('logPath')
        if (!existsSync(logPath)) {
          mkdirSync(logPath)
        }

        const destStreams: Array<{ stream: any; level?: any }> = [
          {
            stream: LogStream({
              logdir: logPath,
              nameformat: '[wxkf-manager.]YYYY-MM-DD[.log]',
            }),
          },
        ]

        if (isDev) {
          const prettyStream = pretty({
            include: 'level,time,token',
            singleLine: true,
            messageFormat: '[{context}] {msg}',
          })
          destStreams.push({
            stream: prettyStream,
            level: 'debug',
          })
        }

        return {
          pinoHttp: [
            {
              level: isDev ? 'debug' : 'info',
              formatters: {
                level: label => {
                  return { level: label }
                },
              },
              autoLogging: false,
            },
            multistream(destStreams),
          ],
        }
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const mongoUri = config.get('mongoUri')
        return {
          uri: mongoUri,
        }
      }
    })
  ]
})
export class WxkfManagerModule {}