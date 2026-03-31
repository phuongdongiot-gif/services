import { Resolver, Query, Args, ID, ResolveReference } from '@nestjs/graphql';
import { UserType } from '../types/user.type';
import { IUserUseCase } from '../../../../core/ports/inbound/user.use-case.port';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userUseCase: IUserUseCase) {}

  @Query(() => UserType, { nullable: true })
  async user(@Args({ name: 'id', type: () => ID }) id: string) {
    return this.userUseCase.getUserProfile(id);
  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    return this.userUseCase.getUserProfile(reference.id);
  }
}
