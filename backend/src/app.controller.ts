import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { VotingTokenDto } from './dtos/VotingTokenDto';
import { AddToWhitelistDto } from './dtos/AddToWhitelistDto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("get-contract-address")
  getContractAddress() {
    const result = this.appService.getContractAddress();
    return { result };
  }
  @Post("add-whitelist")
  addToWhitelist(
    @Body() body: AddToWhitelistDto) {
      return this.appService.addToWhitelist(body);
  }
  @Post("claim-tokens")
  claimTokens(
    @Body() body: VotingTokenDto) {
    return this.appService.claimTokens(body);
  }

  @Get("recent-votes")
  recentVotes(): string {
    return this.appService.recentVotes();
  }
}
