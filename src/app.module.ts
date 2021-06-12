import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthZModule, AUTHZ_ENFORCER } from 'nest-authz';
import * as casbin from 'casbin';
import TypeORMAdapter from 'typeorm-adapter';

@Module({
  imports: [
    AuthZModule.register({
      model: './model.conf',
      policy: TypeORMAdapter.newAdapter({
        name: 'casbin',
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'db2inst1',
        password: 'db2inst1',
        database: 'openlabs',
      }),
      // enforcerProvider: {
      //   provide: AUTHZ_ENFORCER,
      //   useFactory: async () => {
      //     return casbin.newEnforcer('./model.conf', './policy.csv');
      //   },
      // },
      usernameFromContext: (ctx) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user && request.user.username;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
