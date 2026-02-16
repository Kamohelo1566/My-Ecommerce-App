import moongoose from 'mongoose';

const cartItemsSchema = new moongoose.Schema({
    //reference to the product
    product: {
        type:moongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true,

    },
    quantity: {
        type:Number,
        required:true,
        min:1,
        default:1,
    },
});

const cartSchema = new moongoose.Schema({
    user:{
        type: moongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    clerkId:{
        type:String,
        required:true,
        unique:true,
    },
    items:[cartItemSchema]

    },
    {timestamps:true});

    export const Cart = moongoose.model("Cart", cartSchema);