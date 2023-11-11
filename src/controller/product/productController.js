const Product = require("../../Database/productSchema");

const createProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image, category, description } = req.body;
        let exists = await Product.findOne({name});
        if(exists) return res.status(500).json({ message: "Product name already exist use another name" });
        let newProduct = new Product({
            name, image, category, description
        })
        await newProduct.save();
        res.status(200).json({ load: newProduct });
    } catch (err) {

        return res.status(500).json({ message: "Server error" });
    }
}

const getProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const load = await Product.findOne({ _id: productId });
        if (load) return res.status(500).json({ message: "No products found" });
        res.status(200).json({ load });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}

const deleteProduct = async (req, res) => {
    try {

        const { productId } = req.params;
        await Product.findByIdAndDelete(productId);

        res.status(200).json({ load: "Product deleted" });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}

const fetchAllProduct = async (req, res) => {
    try {
        const { page, pageSize, productName, category } = req.query;
        const query = {
            name: new RegExp(productName, 'i'),
            category: new RegExp(category, 'i')
        };

        const allProduct = await Product.find(query)
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize))
            .exec();
        res.status(200).json({ allProduct });
    } catch (err) {

        return res.status(500).json({ message: "Server error" });
    }
}

module.exports.deleteProduct = deleteProduct;
module.exports.getProduct = getProduct;
module.exports.createProduct = createProduct;
module.exports.fetchAllProduct = fetchAllProduct;