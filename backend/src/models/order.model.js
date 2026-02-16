import moongoose from 'mongoose';

const orderItemsSchema = new moongoose.Schema({
    product:{
        type: moongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
        min:0,
    },
    quantity:{
        type:Number,
        required:true,
        min:1,
    },
    image:{
        type:String,
        required:true,
    },
});

const shippingAddressSchema = new moongoose.Schema({
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
});

const orderSchema = new moongoose.Schema({
    user:{
        type:moongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    clerkId:{
        type:String,
        required:true,
    },
    orderItems:[orderItemsSchema],

    shippingAddress:{
        type: shippingAddressSchema,
        required:true,
    },
    paymentResult: {
        id:String,
        status:String,
    },
    totalPrice:{
        type:Number,
        required:true,
        min:0,
    },
    status:{
        type:String,
        enum:["pending", "shipped", "delivered"],
        default:"pending",
    },
    deliveredAt:{
        type:Date,

    },
    ShippedAt:{
        type:Date,
    },
},
{timestamps:true});

export const Order = moongoose.model("Order", orderSchema);