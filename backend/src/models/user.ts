import { prop, getModelForClass } from '@typegoose/typegoose'

export class User {
  @prop({
    validate: {
      validator: (val: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/gm.test(val)
      },
      message: 'Invalid email',
    },
    required: true,
    trim: true,
    unique: true,
  })
  public email!: string

  @prop({ required: true })
  public hashedPassword!: string

  @prop({ default: false })
  public isStaff!: boolean
}

export const UserModel = getModelForClass(User, {
  schemaOptions: {
    timestamps: true,
    versionKey: false,
    toObject: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
      },
    },
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
      },
    },
  },
})
