import {Cart} from "../models/cart.model.js";
import {Product} from "../models/product.model.js";

//method to get the cart of the logged in user
export async function getCart(req,res){
    try {
        //finds the cart for user (fetching the cart for the logged in user)
        let cart = await Cart.findOne({clerkId: req.user.clerkId}).populate;

        if (!cart){
            cart = await Cart.create({
                user: user._id,
                clerkId: user.clerkId,
                items: [],
            });
        }
    res.status(200).json({cart});
}
    catch (error){
        console.error("Error in getCart controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

//method to add items to cart
export async function addToCart(req,res){
try{
    const {productId,quantity=1} = req.body;

    //validate product exists and has stock
    const product = await Product.findById(productId);
    if (!product){
        return res.status(404).json({error:"Product not found"});
    }

    if(product.stock < quantity){
        return res.status(400).json({error:"Insufficient stock"});
    }

    let cart = await Cart.findOne({clerkId: req.user.clerkId});

    if (!cart){
        cart = await Cart.create({
            user: user._id,
            clerkId: user.clerkId,
            items: [],
        });
    }
//check if product already in cart
const existingItem = cart.items.find((item) => item.product.toString() === productId);
if (existingItem){

    //increment quantity by 1
    const newQuantity = existingItem.quantity + 1;
    if(product.stock < newQuantity){
        return res.status(400).json({error:"Insufficient stock"});
    }
    existingItem.quantity = newQuantity;
}else {
    //add new item to cart
    cart.items.push({product: productId, quantity});
}

await cart.save();
res.status(200).json({ message: "Item added to cart", cart });

  } catch (error) {
    console.error("Error in addToCart controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

//method to increment or decrement the quantity of a cart item
export async function UpdateCartItem(req,res){
    try {
        //getting the productId from the urls parameters(:productId)(cart.route.js))
        const {productId} = req.params;
        const {quantity} = req.body;

        if(quantity < 1){
            return res.status(400).json({error:"Quantity must be at least 1"});
        }

        const cart = await Cart.findOne({clerkId: req.user.clerkId});
        if (!cart){
            return res.status(404).json({error:"Cart not found"});
        }

        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if(itemIndex === -1){
            return res.status(404).json({error:"Product not found in cart"});
        }

        //check if product exists and validate product stock
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({error:"Product not found"});
        }

        if (product.stock < quantity){
            return res.status(400).json({error:"Insufficient stock"});
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        res.status(200).json({message: "Cart updated successfully", cart});

    } catch (error) {
        console.error("Error in UpdateCartItem controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

//method to remove a product from the cart
export async function removeFromCart(req,res){
    try {
        const {productId} = req.params;

        const cart = await Cart.findOne({clerkId: req.user.clerkId});
        if (!cart){
            return res.status(404).json({error:"Cart not found"});
        }

        //removes a product from the cart (using a delete button)

        //filter - filter removes items from the cart that match the productId and keeps the rest of the items in the cart
        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();

        res.status(200).json({message: "Item removed from cart", cart});

    } catch (error) {
        console.error("Error in removeFromCart controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

//method to clear the cart 
export async function clearCart(req,res){
    try{
        const cart = await Cart.findOne({clerkId: req.user.clerkId});
        if (!cart){
            return res.status(404).json({error:"Cart not found"});
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({message: "Cart cleared successfully", cart});

    } catch (error) {
        console.error("Error in clearCart controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}