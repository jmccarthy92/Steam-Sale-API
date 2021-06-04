import Service from "@Business/services";
import { User as UserEntity, Password as PasswordEntity, Token as TokenEntity } from "@Business/entities/user";
import { User } from "@Data/models/user";
import { getHashAndSalt } from "@Core/shared/auth";
import { Password } from "@Data/models/password";
import { Token } from '@Data/models/token';
import { PartialModelObject } from "objection";

export default class UserService extends Service<User> {
  private passwordService: Service<Password>;
  private tokenService: Service<Token>;

  constructor() {
    super(User);
    this.passwordService = new Service(Password);
    this.tokenService = new Service(Token);
  }

  public async getUserByEmail(email: string, eager: string = ''): Promise<UserEntity> {
      const user = await this.get().findOne('email', email).withGraphFetched(eager);
      return new UserEntity(user);
  }

  public async createUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.insert({ email });
    const userId = user.id || -1;
    if (userId < 0) throw new Error("Error creating user");
    const passwordCreated = await this.createPassword(userId, password);
    return new UserEntity({ ...user, password: passwordCreated });
  }

  public async createToken(token: PartialModelObject<Token>): Promise<TokenEntity> {
    const tokenCreated = await this.tokenService.insert(token)
    return new TokenEntity(tokenCreated)
  }

  private async createPassword(userId: number | string, password: string): Promise<PasswordEntity> {
    const { salt, hash } = getHashAndSalt(password);
    const passwordCreated = await this.passwordService.insert({ user_id: userId, salt, hash });
    return new PasswordEntity(passwordCreated)
  }

}
