import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  AuthActionVerb,
  AuthPossession,
  AuthZGuard,
  AuthZRBACService,
  UsePermissions,
} from 'nest-authz';
import { AppService } from './app.service';
import { AuthGuard } from './auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly rbacSvc: AuthZRBACService,
  ) {}

  @Get()
  @UseGuards(AuthGuard, AuthZGuard)
  @UsePermissions({
    action: AuthActionVerb.READ,
    resource: 'site',
    possession: AuthPossession.ANY,
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/add')
  async addPermission(
    @Query('user') user: string,
    @Query('resource') res: string,
    @Query('action') action: string,
  ) {
    await this.rbacSvc.addPermissionForUser(user, res, action, 'allow');
  }

  @Get('/delete')
  async deletePermission(
    @Query('user') user: string,
    @Query('resource') res: string,
    @Query('action') action: string,
  ) {
    return await this.rbacSvc.deletePermissionForUser(
      user,
      res,
      action,
      'allow',
    );
  }

  @Get('/check')
  async checkPermission(@Query('user') user: string) {
    return this.rbacSvc.getPermissionsForUser(user);
  }
}
