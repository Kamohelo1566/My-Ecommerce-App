import moogoose from 'mongoose';

const addressSchema = new moogoose.Schema({
    label:{
        type:String,
        required:true
    },
    fullName:{
        type:String,
        required:true,
    },
    streetAddress:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    province:{
        type:String,
        required:true,
    },
    postalCode:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:String,
        required:true,
    },
    isDefault:{
        type:Boolean,
        default:false,
    }
});

const userSchema = new moogoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        default:""
    },
    clerkId:{
        type:String,
        required:true,
        unique:true
    },
    addresses: [addressSchema],
    wishlist: [
        {
            type: moogoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
    ],
},
    { timestamps:true }

);

export const User = moogoose.model('User', userSchema);