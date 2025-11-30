import { Controller, Patch, Post, Get, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(){
    return this.usersService.findAll();
  }
  @Post()
  create(){
    return this.usersService.create();
  }
  @Patch()
  update(){
    return this.usersService.update();
  }
  @Delete()
  remove(){
    return this.usersService.remove();
  }

}
