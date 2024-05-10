import mongoose, { Schema } from "mongoose";
import { ThemeType } from "../../domain_entities/Theme";

const themeModeSchema:Schema<ThemeType> = new Schema({
    userId:{type:String},
    ThemeMode :{type:String,default:'normalMode'}
})

const ThemeModel = mongoose.model<ThemeType>('ThemeModel',themeModeSchema)
export default ThemeModel