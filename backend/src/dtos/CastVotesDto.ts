export class CastVotesDto {
    constructor(
      public token: string,
      public proposal: number,
      public amount: number
    ) {}
  }