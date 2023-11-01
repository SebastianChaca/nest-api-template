import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  timestamps: true,
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      // delete ret.password;
      delete ret.__v;
    },
  },
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      //delete ret.password;
      delete ret.__v;
    },
  },
})
export class User {
  @ApiProperty({
    example: '6541ad729d7d41d1d9dfb6e0',
    description: 'user id',
    uniqueItems: true,
  })
  id: string;

  @ApiProperty({
    example: 'Sebastian',
    description: 'user name',
  })
  @Prop()
  name: string;

  @ApiProperty({
    example: 'Sebastian@g.com',
    description: 'user email',
  })
  @Prop({ lowercase: true, unique: true })
  email: string;

  @ApiProperty({
    example: 'Hola1234',
    description: 'user password',
  })
  @Prop()
  password: string;

  @ApiProperty({
    example: 'true',
    description: 'user chat satus',
  })
  @Prop({ default: false })
  online: boolean;

  @ApiProperty({
    example: '2023-11-01T01:44:18.657Z',
    description: 'user last active date',
  })
  @Prop({ default: null })
  lastActive: string;

  @ApiProperty({
    example: 'true',
    description: 'if current user is active',
  })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({
    example: '[admin]',
    description: 'user roles',
    enum: ['admin', 'user', 'super-user'],
  })
  @Prop({ default: ['user'] })
  roles: string[];
}
export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.virtual('test').get(function () {
//   return this.email;
// });
