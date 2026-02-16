import moongoose from 'mongoose';

//Object
const reviewSchema = new moongoose.Schema({
    productId:{
        type:moongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true,
    },
    userId:{
        type:moongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    orderId: {
        type:moongoose.Schema.Types.ObjectId,
        ref:'Order',
        required:true,
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5,
    }
}, {timestamps:true});

export const Review = moongoose.model("Review", reviewSchema);