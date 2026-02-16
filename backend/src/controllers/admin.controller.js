import cloudinary from "../config/cloudinary.js";
import {Product} from "../models/product.model.js";
import {Order} from "../models/order.model.js";
import {User} from "../models/user.model.js";

export async function createProduct(req,res){
    try{
        const {name, description, price, stock, category} = req.body;

        //check if all field are filled
        if (!name || !description || !price || !stock || !category){
            return res.status(400).json({message:"All fields are required"});
        }

        //check if images are uploaded 
        if(!req.files || req.files.length === 0){
            return res.status(400).json ({message:"At least one image is required"});
        }

        //check if images are not more than 4
        if (req.files.length > 4){
            return res.status(400).json({message:"Maximum 4 images allowed"});
        }

        //upload images to cloudinary and get the urls
        const uploadPromises = req.files.map((file) => {
            return cloudinary.uploader.upload(file.path, {
                folder: "products",
            });
        });
        
        const uploadResults = await Promise.all(uploadPromises);

        const imageUrls = uploadResults.map((result) => result.secure_url);

        const product = await Product.create({
            name,
            description,
            price: parseFloat(price),
            stock: parseFloat(stock),
            category,
            images: imageUrls,
        });

        res.status(201).json(product);

    } catch (error){
        console.error("Error creating product:", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function getAllProducts(_,res){
    try{
        //-1 means in descending order (latest product first)
        const products = await Product.find().sort({createdAt:-1});
        res.status(200).json(products);

    } catch (error){
        console.error("Error fetching products:", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function updateProduct(req,res){
    try{
        const {id} = req.params;
        const {name, description, price, stock, category} = req.body;

        const product = await Product.findById(id);
        if (!product){
            return res.status(404).json({message:"Product not found"});
        }

        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = parseFloat(price);
        if (stock !== undefined) product.stock = parseFloat(stock);
        if (category) product.category = category;

        //handle images updates if new images are uploaded
        if (req.files && req.files.length > 0){
            if (req.files.length > 4){
                return res.status(400).json({message:"Maximum 4 images allowed"});
            }

            const uploadPromises = req.files.map((file) => {
                return cloudinary.uploader.upload(file.path, {
                    folder: "products",
                });
            });
    
            const uploadResults = await Promise.all(uploadPromises);
            product.images = uploadResults.map((result) => result.secure_url);
        }

        await product.save();
        res.status(200).json(product);

    } catch (error){
        console.error("Error updating product:", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function getAllOrders(_,res){
    //admin can see all the orders placed by users
    try{
        const orders = (await Order.find().populate("user", "name email").populate("orderItems.product")).sort({createdAt:-1});
        res.status(200).json({orders});

    } catch (error){
        console.error("Error in getAllOrders controller:", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function updateOrderStatus(req,res){
    //admin can update order status (pending, shipped, delivered)
    try{
        const {orderId} = req.params;
        const {status} = req.body;

        if (!["pending", "shipped", "delivered"].includes(status)){
            return res.status(400).json({error:"Invalid status"});
        }

        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }

        order.status = status;

        if (status === "shipped" && !order.shippedAt){
            order.shippedAt = new Date();  // current date
        }

        if (status === "delivered" && !order.deliveredAt){
            order.deliveredAt = new Date();
        }

        await order.save();
        res.status(200).json({message:"Order status updated successfully", order});
        
        } catch (error){
        console.error("Error updateOrder controller:", error);
        res.status(500).json({message:"Internal server error"});    
    }
}

export async function getAllCustomers(_,res){
    //admin can see all the customers
    try{
        const customers = await User.find().sort({createdAt:-1}); //lastest customers first
        res.status(200).json({customers});
        
    } catch (error){
        console.error("Error in getAllCustomers controller:", error);
        res.status(500).json({message:"Internal server error"});
    }
}


export async function getDashboardStats(_,res){ 
    //admin can see dashboard stats (total sales, total orders, total customers)
    try{
        const totalOrders = await Order.countDocuments();

        const revenueResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalPrice" },
                },
            },
        ]);

        const totalRevenue = revenueResult[0]?.total || 0;
        const totalCustomers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        res.status(200).json({
            totalOrders,
            totalRevenue,
            totalCustomers,
            totalProducts,
        });

    } catch (error){
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({message:"Internal server error"});
    }
}