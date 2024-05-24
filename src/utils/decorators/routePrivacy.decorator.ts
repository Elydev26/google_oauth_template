import { SetMetadata } from "@nestjs/common"

export const Public=()=>{
    return SetMetadata('Public',true);
}