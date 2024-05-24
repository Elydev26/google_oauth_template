import { Module } from "@nestjs/common";
import { Mongoose } from "mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserModel } from "./model/user.model";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./services/user.service";

@Module({
    providers:[UserService],
    controllers:[UserController],
    exports:[UserService],
    imports:[
        MongooseModule.forFeatureAsync([
            {
              name: User.name,
              useFactory: () => {
                return UserModel;
              },
            },
          ]),
    ]
})
export class UserModule {

}