import {User} from "../models/user.model.js";

export async function addAddress(req, res) {
    try {
        const {label, fullName, streetAddress, city, province, postalCode, phoneNumber, isDefault} = req.body;

        const user = req.user;//fetch the user from the request (set by auth middleware)

        if(!fullName || !streetAddress || !city || !province || !postalCode || !phoneNumber){
            return res.status(400).json({error:"All fields are required"});
        }

        //if this is set at default , unset all other default
        if(isDefault){
            user.addresses.forEach(addr => {addr.isDefault = false});
        }

        //add the new address to user's addresses
        user.addresses.push({
            label,
            fullName,
            streetAddress,
            city,
            province,
            postalCode,
            phoneNumber,
            isDefault: isDefault || false
        });

        await user.save();

        res.status(201).json({message:"Address added successfully", addresses: user.addresses});
        
    } catch (error) {
        console.error("Error in addAddress controller:", error);
        res.status(500).json({message:"Internal server error"});
    
    }
}

export async function getAddresses(req, res) {
    try {

        //fetch the user from the request (set by auth middleware)
        const user = req.user;

        res.status(200).json({addresses: user.addresses});
        
    } catch (error) {
        console.error("Error in getAddresses controller :", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function updateAddress(req, res) {
    try {

        const {label, fullName, streetAddress, city, province, postalCode, phoneNumber, isDefault} = req.body;

        //fetch the addressId from the request parameters
        const {addressId} = req.params;

        const user = req.user;//fetch the user from the request (set by auth middleware)
        const address = user.addresses.id(addressId);

        if(!address){
            return res.status(404).json({message:"Address not found"});
        }

        //if this is set at default , unset all other default
        if(isDefault){
            user.addresses.forEach(addr => {addr.isDefault = false});
        }

        //update the address fields with the new values (if provided)
        address.label = label || address.label;
        address.fullName = fullName || address.fullName;
        address.streetAddress = streetAddress || address.streetAddress;
        address.city = city || address.city;
        address.province = province || address.province;
        address.postalCode = postalCode || address.postalCode;
        address.phoneNumber = phoneNumber || address.phoneNumber;
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;
        
        //save the user document with the updated address
        //await: wait for the save operation to complete before sending the response
        await user.save();
        res.status(200).json({message:"Address updated successfully", addresses: user.addresses});

    } catch (error) {
        console.error("Error in updateAddresses controller :", error);
        res.status(500).json({message:"Internal server error"});
    
    }
}

export async function deleteAddress(req, res) {
    try {
        const {addressId} = req.params; //fetch the addressId from the request parameters

        const user = req.user; //fetch the user from the request (set by auth middleware)

        //delete the address with the given id from user's addresses
        user.addresses.pull(addressId);
        await user.save(); //save the user document after deletion

        res.status(200).json({message: "Address deleted successfully"});
        
    } catch (error) {
        console.error("Error in deleteAddress controller :", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function addToWishlist(req, res) {
    try {
        const {productId} = req.body; //fetch the productId from the request body
        const user = req.user;

        //check if the product is already in the wishlist
        if(user.wishlist.includes(productId)){
            return res.status(400).json({message:"Product already in wishlist"});
        }

        user.wishlist.push(productId); //add the product to the wishlist
        await user.save(); //save the user document after adding to wishlist

        res.status(200).json({message:"Product added to wishlist", wishlist: user.wishlist});
    } catch (error) {
        console.error("Error in addToWishlist controller:", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function removeFromWishlist(req, res) {
    try {
        const {productId} = req.params; //fetch the productId from the request parameters
        const user = req.user;

        if (!user.wishlist.includes(productId)){
            return res.status(404).json({message:"Product not found in wishlist"});
        }

        user.wishlist.pull(productId);
        await user.save();
         res.status(200).json({message: "Product removed from wishlist"});
        
    } catch (error) {
        console.error("Error in removeFromWishlist controller:", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function getWishlist(req, res) {
    try {
        const user = await User.findById(req.user._id).populate("wishlist");

        res.status(200).json({wishlist: user.wishlist});
        
    } catch (error) {
        console.error("Error in getWishlist controller:", error);
        res.status(500).json({message:"Internal server error"});
    }
}





