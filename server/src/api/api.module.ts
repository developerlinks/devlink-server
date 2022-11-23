import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { BlogModule } from './blog/blog.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [LoginModule, AccountModule, BlogModule],
})
export class ApiModule {}
